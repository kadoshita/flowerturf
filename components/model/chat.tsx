import { Grid } from '@mui/material';
import {
  LocalAudioStream,
  SkyWayContext,
  Channel,
  LocalPerson,
  Publication,
  SkyWayChannel,
  RemoteMember,
  Subscription,
} from '@skyway-sdk/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MenuAppBar from '../../components/model/appBar';
import MySelfUserItem from '../../components/model/mySelfUserItem';
import { RootState } from '../../store';
import fetch from 'node-fetch';
import UserItem from './userItem';

const Chat = () => {
  const router = useRouter();
  const roomName: string = useSelector((state: RootState) => state.room.room.name);
  const userName: string = useSelector((state: RootState) => state.user.user.name);
  const audioInputDevice = useSelector((state: RootState) => state.device.audioInput.deviceId);
  const [localAudioStream, setLocalAudioStream] = useState<LocalAudioStream | null>(null);
  const [skywayChannel, setSkyWayChannel] = useState<Channel>();
  const [memberMySelf, setMemberMySelf] = useState<LocalPerson>();
  const [myPublication, setMyPublication] = useState<Publication | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [members, setMembers] = useState<RemoteMember[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    let localStream: LocalAudioStream;
    const getAudioStream = async () => {
      const getAudioTrack = async () => {
        localAudioStream?.track.stop();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: { deviceId: audioInputDevice },
        });
        const [track] = stream.getAudioTracks();
        localStream = new LocalAudioStream('audio', track.clone());
        setLocalAudioStream(localStream);
        stream.getAudioTracks().forEach((t) => t.stop());
      };

      getAudioTrack();
    };
    getAudioStream();

    return () => {
      localStream.track.stop();
      setLocalAudioStream(null);
    };
  }, [audioInputDevice]);

  useEffect(() => {
    let member: LocalPerson;
    let channel: Channel;
    (async () => {
      const authServerUrl = process.env.NEXT_PUBLIC_SKYWAY_AUTH_SERVER_URL || '';
      const res = await fetch(`${authServerUrl}?roomName=${roomName}`);
      const json = await res.json();
      const { token } = json;
      const context = await SkyWayContext.Create(token, {
        logLevel: 'debug',
      });
      channel = await SkyWayChannel.FindOrCreate(context, {
        name: roomName,
      });
      channel.onClosed.add(() => {
        console.log(`channel ${channel.name} closed`);
      });
      channel.onMemberJoined.add(({ member }) => {
        console.log(`member ${member.name} joined`);
        if (member.side === 'remote') {
          setMembers([...members, member as RemoteMember]);
        }
      });
      channel.onMemberLeft.add(({ member }) => {
        console.log(`member ${member.name} left`);
        setMembers([...members.filter((m) => m.name !== member.name)]);
      });
      channel.onStreamPublished.add(async ({ publication }) => {
        console.log(`publication ${publication.id} published`);
        if (member && publication.publisher.name !== member.name) {
          await member.subscribe(publication.id);
        }
      });
      channel.onStreamUnpublished.add(async ({ publication }) => {
        console.log(`publication ${publication.id} unpublished`);
      });

      member = await channel.join({
        name: userName,
        metadata: userName,
      });
      member.onJoined.add(() => {
        console.log(`member ${member.name} joined self`);
      });
      member.onLeft.add(() => {
        console.log(`member ${member.name} left self`);
      });
      member.onStreamSubscribed.add(({ subscription }) => {
        setSubscriptions([...subscriptions, subscription]);
      });
      member.onStreamUnsubscribed.add(({ subscription }) => {
        console.log(`member ${subscription.id} unsubscribed`);
        setSubscriptions([...subscriptions.filter((s) => s.id !== subscription.id)]);
      });

      channel.publications.forEach(async (publication) => {
        if (member) {
          await member.subscribe(publication.id);
        }
      });

      setMembers([...channel.members.filter((m) => m.name !== userName)]);
      setSkyWayChannel(channel);
      setMemberMySelf(member);
    })();

    return () => {
      localAudioStream?.track.stop();
      setLocalAudioStream(null);
      (async () => {
        await member.leave();
        if (channel.members.length === 0) {
          await channel.close();
        }
      })();
    };
  }, []);

  useEffect(() => {
    if (isMuted) {
      if (skywayChannel && memberMySelf && myPublication) {
        memberMySelf.unpublish(myPublication.id);
      }
    } else {
      if (skywayChannel && memberMySelf && localAudioStream) {
        memberMySelf.publish(localAudioStream).then((publication) => {
          setMyPublication(publication);
        });
      }
    }
  }, [isMuted]);

  const handleChangeMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div>
      <MenuAppBar roomName={roomName} userName={userName}></MenuAppBar>
      <Grid container spacing={2} padding={1}>
        <Grid item xs={6} lg={3}>
          <MySelfUserItem name={userName} onChangeMute={handleChangeMute}></MySelfUserItem>
        </Grid>
        {members.map((m, i) => {
          return (
            <Grid item xs={6} lg={3} key={i}>
              <UserItem
                name={m.name}
                subscription={subscriptions.find((s) => s.publication.publisher.name === m.name)}
              ></UserItem>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Chat;
