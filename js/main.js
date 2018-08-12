$(document).ready(()=>{
    let peer=null;
    let room=null;
    let localStream=null;
    let remoteStreams={};
    let userdata={
        username:''
    };
    let usersdata={};

    $.getJSON('/js/apikey.json',(data)=>{
        peer=new Peer({
            key:data.key,
            debug:3
        });
    });
    $('#joinroombtn').on('click',()=>{
        let roomname=$('#roomnameipt').val();
        let username=$('#usernameipt').val();
        userdata.username=username;
        usersdata[peer.id]=userdata;
        $('#localusername').text(username?username:peer.id);
        if(roomname){
            $('#roomnametxt').text(roomname);
            $('#joinroom').toggle();
            $('#chat').toggle();

            navigator.mediaDevices.getUserMedia({video:false,audio:true})
            .then(stream=>{
                localStream=stream;
                $('#myvideo').get(0).srcObject=stream;
                room=peer.joinRoom(roomname,{mode:'sfu',stream:stream});
                userdata.username=username;
                connect(room);
            })
            .catch(e=>{
                console.error(e);
            });
        }
    });
    $('#leaveroombtn').on('click',()=>{
        room.close();
        room=null;
        localStream.getTracks().forEach(track => track.stop());
        localStream=null;
        userdata={};
        usersdata={};
        $('#myvideo').get(0).srcObject=null;
        removeChatUserElms();
        $('#joinroom').toggle();
        $('#chat').toggle();
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

    let connect=_room=>{
        _room.on('open',()=>{
            _room.send(userdata);
        });
        _room.on('stream',stream=>{
            console.log(stream);
            addChatUserElm(stream.peerId);
            remoteStreams[stream.peerId]=stream;
            $(`#${stream.peerId}-video`).get(0).srcObject=stream;
            $(`#${stream.peerId}-video`).get(0).play();
        })
        _room.on('data',msg=>{
            console.log(msg);
            if(msg.data.username){
                usersdata[msg.src]={
                    username:msg.data.username
                };
                $(`#${msg.src}-name`).text(msg.data.username);
            }
        });
        _room.on('peerJoin',id=>{
            console.log(id);
            _room.send(userdata);
        });
        _room.on('peerLeave',id=>{
            console.log(id);
            remoteStreams[id]=null;
            usersdata[id]=null;
            removeChatUserElm(id);
        });
    };
    let addChatUserElm=(id)=>{
        let _elm=`
        <div id="${id}" class="col-md-3 chat-user active-user">
            <h4 id="${id}-name" class="modal-title">${(usersdata[id]?usersdata[id].username:id)}</h4>
            <img class="img-thumbnail user-icon" src="https://placehold.jp/150x150.png">
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
            }else{
                remoteStreams[id].getTracks().forEach(track=>track.enabled=true);
                $(`#${id}-mutebtn`).text('Mute');
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
});