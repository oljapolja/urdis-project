$(function() {

   // $('body').fadeOut();


});

jQuery(document).ready(function() {

   jQuery('ul.sf-menu').superfish({
      delay: 300,
      cssArrows:  false
   })
   .after("<div id='mobile-menu'>").clone().appendTo("#mobile-menu");


   $("#mobile-menu").find("*").attr("style", "");
   $("#mobile-menu").children("ul").removeClass("sf-menu");

   $("#mobile-menu").mmenu({
      extensions :  {
         "all" : ['theme-white', "border-none", "pagedim-black", "fx-listitems-slide", "fx-menu-slide"],
         "(max-width: 576px)": ["fullscreen"]
      },
      navbars : {
         content : ["prev", "title", "close"]         
      },
      navbar : {
         title: "Меню"
      }
   });  


   $(".toggle-mnu").click(function() {
      $(this).addClass("on");
   });

   // var $menu = $("#mobile-menu").mmenu();
   var api = $("#mobile-menu").data("mmenu");

   api.bind( "close:finish", function() {      
      $('.toggle-mnu').removeClass('on'); 
   });



   $(".menu-line__items > .menu-line__item").each(function() {
      var wd = $(this).width();
      var wdt = $(this).find(".menu-line__subitems > .menu-line__item");
      wdt.width(wd);
   });


 });