menu.onclick=function MyFunction ()
{
    var x=document.getElementById('top_my_nav')

    if(x.className === "top_nav")
    {
        x.className += " responsive";
    }
    else
    {
        x.className = "top_nav";
    }
}


var text_slide_cur=0;
function showtext_slide(){
    $('#text_slide'+(text_slide_cur+1)).css({opacity: 0}).animate({opacity: 1.0,left: "50px"}, 1000);
    setTimeout(hidetext_slide, 5000);
}
function hidetext_slide(){
    $('#text_slide'+(text_slide_cur+1)).css({opacity: 1}).animate({opacity: 0,left: "-50px"}, 1000,function(){showtext_slide();});
    text_slide_cur=(text_slide_cur+1)%3;
}
$(document).ready(function() {
    showtext_slide();
})
