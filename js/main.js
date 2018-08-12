$(document).ready(()=>{
    console.log('test');
    $('#joinroombtn').on('click',()=>{
        let roomname=$('#roomnameipt').val();
        console.log(roomname);
        if(roomname){
            $('#roomnametxt').text(roomname);
            $('#joinroom').toggle();
            $('#chat').toggle();
        }
    })
});