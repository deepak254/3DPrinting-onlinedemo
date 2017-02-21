                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                if(!window.__td){window.__MT=100;window.__ti=0;window.__td=[];window.__td.length=window.__MT;window.__noTrace=false;}

(function $vpfn_58v_GMK4VsuYGDTwVyAm$g3$1($){if(!window.__noTrace){__td[__ti]=arguments;__ti=__ti>=__MT?0:__ti+1;}


function setViewportPolyfill()
{if(!window.__noTrace){__td[__ti]=arguments;__ti=__ti>=__MT?0:__ti+1;}
var $body=$("body");
var windowWidth=$body.clientRect().width;
var $html=$("html");


function fixClassForWindowWidth(classToRemove1,classToRemove2,classToAdd)
{if(!window.__noTrace){__td[__ti]=arguments;__ti=__ti>=__MT?0:__ti+1;}
if(!$html.hasClass(classToAdd))
{
$html.removeClass(classToRemove1).removeClass(classToRemove2);
$html.addClass(classToAdd);
}
}fixClassForWindowWidth._vpfn='$vpfn_CXBuflm_PIk4NaWy0ynB6g13$8';

if(windowWidth<=767)
{
fixClassForWindowWidth("screen-size-medium","screen-size-small","screen-size-extra-small");
}
else if(windowWidth>767&&windowWidth<=959)
{
fixClassForWindowWidth("screen-size-medium","screen-size-extra-small","screen-size-small");
}
else
{
fixClassForWindowWidth("screen-size-extra-small","screen-size-small","screen-size-medium");
}
}setViewportPolyfill._vpfn='$vpfn_HwBMX_BH8FIRctaO$cAFCg6$4';


if($("body").hasClass("ie6to8"))
{
$("body").ready(setViewportPolyfill);

$(window).resize(setViewportPolyfill);
}

})(jQuery);

