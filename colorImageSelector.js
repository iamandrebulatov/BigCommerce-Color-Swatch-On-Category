/*
for each li 
	color = find span color --- this.text
	url = find main prod image -- this.url
	category Swatch Color Button = matching color.url
end

on click 
*/
	
	
$("span:contains('Color')").parents().eq(2).find('.productAttributeValue li').each( function getColorPhotosSrcs(){

	var listings = $(this);
		prodColor = $(this).find('.name').text();
	console.log(prodColor);
	$(this).find('label').click();

	// find url of img when this li is checked and store it
//	for (i = 0; i < listings.length; i++) {
//		var colorImgSrc += $(document).find('.MagicZoomPlus img').attr('src'); 
//		console.log(colorImgSrc); 
//	}

	var colorBtnSrc[ color ] = $(document).find('.MagicZoomPlus img').attr('src'); 

})


$("span:contains('Color')").parents().eq(2).find('.productAttributeValue li').removeClass('selectedValue').find('.radio span').removeClass('checked'); 
$("span:contains('Color')").parents().eq(2).find('.productAttributeValue li').eq(2).addClass('selectedValue').find('.radio span').addClass('checked'); 

$("span:contains('Color')").parents().eq(2).find('.productAttributeValue li').eq(2).find('label').click();