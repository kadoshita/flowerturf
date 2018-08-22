$(document).ready(()=>{
    const ss=ScreenShare.create({debug:true});

    let peer=null;
    let screensharepeer=null;
    let room=null;
    let screenshareroom=null;
    let localStream=null;
    let localScreenStream=null;
    let screensharinguserid='';
    let remoteStreams={};
    let userdata={
        username:'',
        usericon:null
    };
    let usersdata={};
    let roomname='';
    let audioInputDeviceId='';
    let isChrome=(navigator.userAgent.toLowerCase().indexOf('chrome')!==-1?true:false);

    $('#usernameipt').val(localStorage.getItem('username'));

    let search=location.search;
    if(search.indexOf('?')!==-1){
        let tmp=search.split('?')[1];
        if(tmp.indexOf('room')!==-1){
            if(tmp.split('=')[0]==='room'){
                roomname=tmp.split('=')[1];
            }
        }
    }
    $('#roomnameipt').val(roomname);
    let audiodevicesselect=$('#audioinputselect');
    navigator.mediaDevices.enumerateDevices().then(devices=>{
        devices.forEach(device=>{
            console.log(device);
            if(device.kind==='audioinput'){
                if(device.label){
                    audiodevicesselect.append(`<option value="${device.deviceId}">${device.label}</option>`);
                }else{
                    audiodevicesselect.append(`<option value="${device.deviceId}">${device.kind}</option>`);
                }
            }
        });
    });

    $.getJSON('/js/apikey.json',(data)=>{
        peer=new Peer({
            key:data.key,
            debug:3
        });
        peer.on('open',id=>{
            $('#status-icon').removeClass('status-icon-offline');
            $('#status-icon').addClass('status-icon-online');
            $('#skyway-statustxt').text('SkyWay Status : online');
        });
        peer.on('disconnected',()=>{
            $('#status-icon').addClass('status-icon-offline');
            $('#status-icon').removeClass('status-icon-online');
            $('#skyway-statustxt').text('SkyWay Status : offline');
        });

        screensharepeer=new Peer({
            key:data.key,
            debug:3
        });
    });
    $('#usericonpit').on('change',e=>{
        let file=e.target.files[0];
        userdata.usericon=file;
        $('#localusericon').attr('src',URL.createObjectURL(file));
        $('#localusericon').on('load',()=>{
            if($('#localusericon').get(0).width>256||$('#localusericon').get(0).height>256){
                swal({
                    title: 'Icon Size Error!',
                    text: 'Please use images of 256px or less in height and width.',
                    icon: 'error',
                });
                userdata.usericon=null;
                $('#localusericon').attr('src','./img/usericon.png');
            }
            if($('#localusericon').get(0).width!==$('#localusericon').get(0).height){
                swal({
                    title: 'Icon Size Error!',
                    text: 'Please use square image',
                    icon: 'error',
                });
                userdata.usericon=null;
                $('#localusericon').attr('src','./img/usericon.png');
            }
        });
    });
    $('#joinroombtn').on('click', () => {
        if (!$('#termscheck').prop('checked')) {
            swal({title:'本サービスを利用する際は、利用規約とプライバシーポリシーに同意する必要があります。',icon:'info'});
            return;
        }
        gtag('event', 'joinroom');
        audioInputDeviceId=audiodevicesselect.val();
        roomname=$('#roomnameipt').val();
        history.replaceState('','','?room='+roomname);
        let username=$('#usernameipt').val();
        localStorage.setItem('username',username);
        userdata.username=username;
        usersdata[peer.id]=userdata;
        $('#localusername').text(username?username:peer.id);
        if(roomname){
            $('#roomnametxt').text(`Room : ${roomname}`);
            $('#joinroom').toggle();
            $('#chat').toggle();

            navigator.mediaDevices.getUserMedia({video:false,audio:{deviceId:audioInputDeviceId}})
            .then(stream=>{
                localStream=stream;
                $('#myvideo').get(0).srcObject=stream;
                room=peer.joinRoom(roomname,{mode:'sfu',stream:stream});
                userdata.username=username;
                connect(room,true);
            })
            .catch(e=>{
                swal({
                    title: 'getUserMedia Error!',
                    text: `Please check your microphone.\n${e.toString()}`,
                    icon: 'error',
                });
            });
        }
    });
    $('#leaveroombtn').on('click',()=>{
        room.close();
        room=null;
        localStream.getTracks().forEach(track => track.stop());
        localStream=null;
        ss.stop();
        localScreenStream=null;
        if(screensharinguserid){
            $('#screensharebtn').toggle();
        }
        userdata={};
        usersdata={};
        $('#myvideo').get(0).srcObject=null;
        let good=document.createElement('a');
        let goodicon=document.createElement('i');
        goodicon.className='material-icons ratingicons';
        goodicon.textContent='thumb_up';
        good.appendChild(goodicon);
        good.href='#';
        good.onclick=()=>{
            gtag('event','good',{'event_category':'rating'});
            swal.close();
        };
        let bad=document.createElement('a');
        let badicon=document.createElement('i');
        badicon.className='material-icons ratingicons';
        badicon.textContent='thumb_down';
        bad.appendChild(badicon);
        bad.href='#';
        bad.onclick=()=>{
            gtag('event','bad',{'event_category':'rating'});
            swal.close();
            let formurl='https://docs.google.com/forms/d/e/1FAIpQLSdic9ACUKFxZC3KZa2DWmgzOly3mJ17u7qUaMJnTM69g25W_w/formResponse';
            
            swal('気になった点があればご記入ください',{content: 'input'}).then(value=>{
                $.ajax({
                    url: formurl,
                    data: {'entry.1118083239': value},
                    type: 'POST',
                    dataType: 'xml',
                    statusCode: {
                        0: ()=>{
                            swal('フィードバックを送信しました。ご協力ありがとうございました。');
                        },
                        200: ()=>{
                            swal('フィードバックを送信しました。ご協力ありがとうございました。');
                        }
                    }
                });
            });
        };
        let goodbad=document.createElement('div');
        goodbad.appendChild(good);
        goodbad.appendChild(bad);
        swal('SkyWay Multi Voice Chatの使い心地はいかがでしたか?',{button:false,content:goodbad});
        removeChatUserElms();
        $('#joinroom').toggle();
        $('#chat').toggle();
        $("#chatmessages").empty();
    });
    $('#local-mutebtn').on('click',()=>{
        if($('#local-mutebtn').text()==='Mute'){
            localStream.getTracks().forEach(track=>track.enabled=false);
            $('#local-mutebtn').text('Unmute');
        }else{
            localStream.getTracks().forEach(track=>track.enabled=true);
            $('#local-mutebtn').text('Mute');
        }
    });
    $('#screensharebtn').on('click',()=>{
        if(!localScreenStream){
            if(ss.isScreenShareAvailable()){
                gtag('event', 'screenshare');
                ss.start().then(stream=>{
                    $('#myscreen').get(0).srcObject=stream;
                    localScreenStream=stream;
                    screenshareroom=screensharepeer.joinRoom(roomname,{mode:'sfu',stream:stream});
                    connect(screenshareroom,false);
                }).catch(err=>{
                    swal({
                        title: 'screen capture Error!',
                        icon: 'error',
                    });
                });
                $('#screensharebtn').text('Screen Share Stop');
            }else{
                if(isChrome){
                    swal({
                        title: '画面共有用拡張機能をインストールしてください。',
                        text: 'OKをクリックするとインストールページを開きます。',
                        icon: 'info',
                    }).then(()=>{
                        window.open('https://chrome.google.com/webstore/detail/skyway-multi-voice-chat-s/nakmojfkhggecppohmgocbaoafpgbkjg');
                    });
                }else{
                    swal('最新のブラウザをインストールしてください。');
                }
            }
        }else{
            ss.stop();
            screenshareroom.close();
            screenshareroom=null;
            localScreenStream.getTracks().forEach(track=>{
                track.stop();
            });
            $('#myscreen').get(0).srcObject=null;
            localScreenStream=null;
            $('#screensharebtn').text('Screen Share Start').toggle();
        }
    });
    $('#fullscreen-icon').on('click',()=>{
        let _videoelm=$('#myscreen').get(0);
        if(_videoelm.requestFullscreen){
            _videoelm.requestFullscreen();
        }else if(_videoelm.mozRequestFullScreen){
            _videoelm.mozRequestFullScreen();
        }else if(_videoelm.webkitRequestFullScreen){
            _videoelm.webkitRequestFullScreen();
        }else if(_videoelm.msRequestFullscreen){
            _videoelm.msRequestFullscreen();
        }else{
            swal({
                title: 'FullScreen Error!',
                text: `FullScreen is unavailable.`,
                icon: 'error',
            });
        }
    });
    $('#chatsendmessagebtn').on('click',()=>{
        gtag('event', 'chat');
        let sendmsg=$('#chatsendmessageipt').val();
        room.send({chatmsg:sendmsg});
        addChatMessageElm(peer.id,sendmsg);
        $('#chatsendmessageipt').val('').focus();
    });
    $('#chatsendmessageipt').on('keydown',e=>{
        gtag('event', 'chat');
        if(e.keyCode===13){
            e.preventDefault();
            let sendmsg=$('#chatsendmessageipt').val();
            room.send({chatmsg:sendmsg});
            addChatMessageElm(peer.id,sendmsg);
            $('#chatsendmessageipt').val('').focus();
        }
    });

    let connect=(_room,isUser)=>{
        _room.on('open',()=>{
            if(isUser){
                _room.send(userdata);
            }
        });
        _room.on('stream',stream=>{
            if(isUser){
                if(stream.getAudioTracks()[0]){
                    addChatUserElm(stream.peerId);
                    _room.send(userdata);
                    remoteStreams[stream.peerId]=stream;
                    $(`#${stream.peerId}-video`).get(0).srcObject=stream;
                    $(`#${stream.peerId}-video`).get(0).play();
                }else{
                    screensharinguserid=stream.peerId;
                    if(!localScreenStream){
                        $('#myscreen').get(0).srcObject=stream;
                        $('#myscreen').get(0).play();
                        $('#screensharebtn').toggle();
                    }
                }
            }
        });
        _room.on('removeStream', stream => {
            console.log(stream);
        });
        _room.on('data',msg=>{
            if(isUser){
                console.log(msg);
                if(msg.data.username){
                    usersdata[msg.src]={
                        username:msg.data.username,
                        usericon:msg.data.usericon
                    };
                    $(`#${msg.src}-name`).text(msg.data.username);
                    if(msg.data.usericon){
                        setTimeout(()=>{
                            const dataView = new Uint8Array(msg.data.usericon);
                            const dataBlob = new Blob([dataView]);
                            const url = URL.createObjectURL(dataBlob);
                            $(`#${msg.src}-icon`).attr('src',url);
                        },500);
                    }
                }
                if(msg.data.chatmsg){
                    addChatMessageElm(msg.src,msg.data.chatmsg);
                }
            }
        });
        _room.on('peerJoin',id=>{
            console.log(id);
        });
        _room.on('peerLeave',id=>{
            console.log(id);
            if(isUser){
                remoteStreams[id]=null;
                usersdata[id]=null;
                removeChatUserElm(id);
            }
            if(id===screensharinguserid){
                $('#myscreen').get(0).srcObject=null;
                $('#screensharebtn').toggle();
                screensharinguserid='';
            }
        });
    };

    let addChatUserElm=(id)=>{
        let _elm=`
        <div id="${id}" class="col-md-3 chat-user active-user">
            <p id="${id}-name" class="modal-title">${(usersdata[id]?usersdata[id].username:id)}</p>
            <img id="${id}-icon" class="img-thumbnail user-icon" src="./img/usericon.png">
            <video id="${id}-video" autoplay></video>

            <div class="text-center control-btn">
                <button id="${id}-mutebtn" class="btn btn-secondary">Mute</button>
            </div>
        </div>`;

        $('#chat-users').append(_elm);

        $(`#${id}-mutebtn`).on('click',()=>{
            if($(`#${id}-mutebtn`).text()==='Mute'){
                remoteStreams[id].getTracks().forEach(track=>track.enabled=false);
                $(`#${id}-mutebtn`).text('Unmute');
                $(`#${id}`).removeClass('active-user');
                $(`#${id}`).addClass('mute-user');
            }else{
                remoteStreams[id].getTracks().forEach(track=>track.enabled=true);
                $(`#${id}-mutebtn`).text('Mute');
                $(`#${id}`).removeClass('mute-user');
                $(`#${id}`).addClass('active-user');
            }
        })
    };

    let removeChatUserElm=(id)=>{
        $(`#${id}`).remove();
    }

    let removeChatUserElms=()=>{
        let elms=$('.chat-user');
        for(let i=0;i<elms.length;i++){
            if(elms[i].className.indexOf('local-user')===-1){
                elms[i].remove();
            }
        }
    };

    let addChatMessageElm=(id,msg)=>{
        let _data=usersdata[id];
        let _username='';
        let t=new Date();
        if(_data){
            if(_data.username){
                _username=_data.username;
            }else{
                _username=id;
            }
        }else{
            _username=id;
        }
        let _usericon;
        if(!usersdata[id]){
            _usericon='./img/usericon.png';
        }else if(!usersdata[id].usericon){
            _usericon='./img/usericon.png';
        }else{
            const dataView = new Uint8Array(usersdata[id].usericon);
            const dataBlob = new Blob([dataView]);
            _usericon=URL.createObjectURL(dataBlob);
        }
        let _elm=`
        <div class="row chatmessage">
            <div class="col-2">
                <img class="img-thumbnail chatmessageusericon" src="${_usericon}">
            </div>
            <div class="col-10 text-left">
                <p class="chatmessageuser">${_username} <span class="chatmessagetime">${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}</span></p>
                <p>${escapeHtml(msg)}</p>
            </div>
        </div>`;

        $('#chatmessages').append(_elm);
        $('#chatmessages').get(0).scrollTop=$('#chatmessages').get(0).scrollHeight;
    };
    let escapeHtml=str=>{
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#39;');
        return str;
    }
});