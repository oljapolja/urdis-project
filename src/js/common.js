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

   $('.owl-carousel').owlCarousel({
      loop:true,
      margin:0,
      nav:true,
      navText: "",
      // autoplay: true,
      autoplayHoverPause:true,
      smartSpeed: 600,
      responsive:{
          0:{
              items:1
          }
      }
  });

  $('.slider-button-prev').click(function() {
     $('.owl-carousel').trigger("prev.owl");
  });

  $('.slider-button-next').click(function() {
   $('.owl-carousel').trigger("next.owl");
   });


   // $(".services-section__item-image").equalHeights();
   $(".services-section__item-title").equalHeights();
   $(".news-section__text-area").equalHeights();
   $(".goverment-portals-section__item").equalHeights();


   $(".connection-info__button").click(function() {
      $("#callback input.formname").attr("value", $(this).data("form"));
      }).magnificPopup({
         type: 'inline',
         mainClass: 'mfp-fade',
         fixedContentPos: false
   });

   $(".feedback").submit(function() {
      $.ajax({
         type: "GET",
         url: "mail.php",
         data: $(this).serialize() // собирает поля формы и отправляет на mail.php
      }).done(function() {
         $(".success").addClass("visible");
         setTimeout(function() {
            $(".feedback").trigger("reset"); // сбрасываем поля формы после сабмита
            $(".success").removeClass("visible");
            $.magnificPopup.close();
         }, 2000);
      });
      return false;
   });

      // $(".button-section .button").click(function() {
      //    $("#callback .feedback__title").html($(this).text());
      //    $("#callback input.enabled").attr("value", $(this).text());
      // }).magnificPopup({
      //        type: 'inline',
      //        mainClass: 'mfp-fade',
      //        fixedContentPos: false
      //    });
   


 });