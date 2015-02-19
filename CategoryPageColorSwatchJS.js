    $('<style type="text/css">\
			/* Color and Size Options on Category Pages */\
			.catSizeSwatch {\
				display: none;\
			}\
			.catColorSwatch {\
				display: inline-block;\
			}\
			.catColorSwatch .validation,\
			.catColorSwatch .name,\
			.catSizeSwatch .validation,\
			.catSizeSwatch .name {\
				display: none;\
			}\
			.catColorSwatch .swatchColour {\
				display: inline-block;\
				width: 17px !important;\
				height: 17px !important;\
				border: 1px solid #fff;\
			}\
			.catColorSwatch li.swatch.swatchOneColour {\
				display: inline-block;\
				float: left;\
				width: auto !important;\
				padding: 0;\
				border: 1px solid #d5d5d5;\
				margin: 5px 4px 1px 1px;\
			}\
			.catColorSwatch li.swatch.swatchOneColour.selectedColorBox {\
				padding: 0;\
			}\
			.catColorSwatch .swatch.swatchOneColour label {\
				margin: 0;\
				line-height: normal;\
			}\
			.catColorSwatch .swatch.swatchOneColour span.swatchColours.swatchOneColour {\
				line-height: inherit;\
			}\
			</style>')
        .appendTo('head');
    /* try to combine this with category videos! */
    $(document).ready(function() {
        // Swatches - Color and Size options swatches 
        $(".Options").each(function checkForOptionSwatches(url) {
            var productListing = $(this).closest('em.p-price').html();
            productLink = $(this).parent().parent().find('div.ProductImage a').attr('href');
            var $this = $(this);

            function getOptionSwatches() {
                return $.ajax({
                    url: productLink,
                    type: 'GET',
                    dataType: 'html',
                    //async: false
                });
            }
            getOptionSwatches()
                .done(function(data) {

                    result = data;
                    var productPage = result;
                    $productPageProcessing = $(productPage).find('.productAttributeList');
                    colorSwatch = $productPageProcessing.find("span:contains('Color')").parents().eq(2).find('.productAttributeValue div').html();
                    sizeSwatch = $productPageProcessing.find("span:contains('Size')").parents().eq(2).find('.productAttributeValue div').html();
                    if (colorSwatch != null) {
                        $this.parent().parent().find('.ProductDetails').before('<div class="catColorSwatch optionSwatch">' + colorSwatch + '</div>');
                        $this.addClass('withColorSwatch');
                        // Color swatch clickability Starts here
                        $(".withColorSwatch").each(function() {
                            var productDiv = $(this).parent().parent();
                            var productColorSwatch = productDiv.find('.catColorSwatch');
                            var productName = productDiv.find('.pname').text();
                            var images = [];
                            var productId = productDiv.find('div.ProductImage').attr('data-product');

                            // We can pull the color values from the DOM! :)
                            var colors = [];
                            productColorSwatch.find("input.validation").each(function() {
                                colors.push({
                                    value: $(this).val(),
                                    name: $(this).parent().find("span.swatchColours").attr("title"),
                                    url: ''
                                });
                            });

                            var queue = Array.prototype.concat.call(colors); // Make a copy of the array
                            function poll(cb) {
                                // Is queue finished ?
                                if (!queue.length) {
                                    cb();
                                    return;
                                }

                                // Next color in queue
                                var color = queue.pop();
                                var attributeValue = productColorSwatch.find('.validation').attr('name').replace(/\D/g, '');
                                var args = {
                                    action: "add",
                                    w: "getProductAttributeDetails",
                                    product_id: productId,
                                    attribute: []
                                };
                                args.attribute[attributeValue] = color.value;

                                $.post("/remote.php", args, function(response) {
                                    if (response && response.details && response.details.image) {
                                        result[color.name] = response.details.image;
                                        color.url = response.details.image;
                                    }
                                    poll(cb); // Next in queue
                                });

                                var productImage = productDiv.find('.ProductImage a img');
                                var colorSwatchBox = productColorSwatch.find('.validation[value=' + color.value + ']').parent().parent();
                                var activeImage = productImage.attr('src');
                                productImage.attr('data-original', activeImage);
                                var originalImage = productImage.attr('data-original');
                                colorSwatchBox.on({
                                    mouseenter: function(event) {
                                        originalImage = $(this).parents().eq(2).find('.ProductImage a img').attr('data-original');
                                        $(this).parents().eq(2).find('.ProductImage a img').attr('src', color.url);
                                        if (!$(this).hasClass('selectedColorBox')) {
                                            $(this).css({
                                                'border': '2px solid #666',
                                                'margin': '4px 3px 0 0'
                                            });
                                        }
                                    },
                                    mouseleave: function(event) {
                                        if (!$(this).hasClass('selectedColorBox')) {
                                            $(this).css({
                                                'border': '1px solid #d5d5d5',
                                                'margin': '5px 4px 1px 1px'
                                            });
                                            //productImage.attr('src', activeImage);
                                            $(this).parents().eq(2).find('.ProductImage a img').attr('src', originalImage);
                                        }
                                    },
                                    click: function(event) {
                                        $(this).parent().find('li').removeClass('selectedColorBox');
                                        $(this).addClass('selectedColorBox');
                                        $(this).parents().eq(2).find('.ProductImage a img').attr('src', color.url);
                                        $(this).parents().eq(2).find('.ProductImage a img').attr('data-original', color.url);
                                        $(this).parent().find('li').css({
                                            'border': '1px solid #d5d5d5',
                                            'margin': '5px 4px 1px 1px'
                                        });
                                        $(this).css({
                                            'border': '2px solid #39b54a',
                                            'margin': '4px 3px 0 0'
                                        });
                                        //activeImage = $(this).parents().eq(2).find('.ProductImage a img').attr('src');
                                    }
                                });
                            }

                            poll(function() {
                                console.log('Why do I need this?');
                            });

                        });
                        // Color swatch clickability ends here
                    };
                    if (sizeSwatch != null) {
                        $this.parent().parent().find('em.p-price').before('<div class="catSizeSwatch optionSwatch">' + sizeSwatch + '</div>');
                    };
                }).fail(function() {
                    return;
                });
        });

    });