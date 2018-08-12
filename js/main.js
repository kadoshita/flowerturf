$(document).ready(()=>{
    let peer=null;
    let room=null;

    $.getJSON('/js/apikey.json',(data)=>{
        peer=new Peer({
            key:data.key,
            debug:3
        });
    });
    $('#joinroombtn').on('click',()=>{
        let roomname=$('#roomnameipt').val();
        console.log(roomname);
        if(roomname){
            room=peer.joinRoom(roomname,{mode:'sfu'});
            room.on('open',()=>{
                connect(room);
            })
            $('#roomnametxt').text(roomname);
            $('#joinroom').toggle();
            $('#chat').toggle();
        }
    });
    $('#leaveroombtn').on('click',()=>{
        room.close();
        peer=null;
        room=null;
        $('#joinroom').toggle();
        $('#chat').toggle();
    });
});

let connect=_room=>{
    _room.on('data',msg=>{
        console.log(msg);
    });
    _room.on('join',id=>{
        console.log(id);
    });
    _room.on('peerLeave',id=>{
        console.log(id);
    });
}