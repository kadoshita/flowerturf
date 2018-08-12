$(document).ready(()=>{
    let peer=null;
    let room=null;
    let localStream=null;
    let remoteStreams={};

    $.getJSON('/js/apikey.json',(data)=>{
        peer=new Peer({
            key:data.key,
            debug:3
        });
    });
    $('#joinroombtn').on('click',()=>{
        let roomname=$('#roomnameipt').val();
        $('#localusername').text(peer.id);
        if(roomname){
            $('#roomnametxt').text(roomname);
            $('#joinroom').toggle();
            $('#chat').toggle();

            navigator.mediaDevices.getUserMedia({video:false,audio:true})
            .then(stream=>{
                localStream=stream;
                $('#myvideo').get(0).srcObject=stream;
                room=peer.joinRoom(roomname,{mode:'sfu',stream:stream});
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
        _room.on('stream',stream=>{
            console.log(stream);
            addChatUserElm(stream.peerId);
            remoteStreams[stream.peerId]=stream;
            $(`#${stream.peerId}-video`).get(0).srcObject=stream;
            $(`#${stream.peerId}-video`).get(0).play();
        })
        _room.on('data',msg=>{
            console.log(msg);
        });
        _room.on('peerJoin',id=>{
            console.log(id);
        });
        _room.on('peerLeave',id=>{
            console.log(id);
            removeChatUserElm(id);
        });
    };
    let addChatUserElm=(id)=>{
        let _elm=`
        <div id="${id}" class="col-md-3 chat-user active-user">
            <h4 class="card-title">${id}</h4>
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