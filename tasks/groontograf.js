/*
 * groontograf
 * ghttp://groontograf.bespoyasov.ru
 *
 * Copyright (c) 2015 Alexander Bespoyasov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.registerMultiTask('groontograf', 'Prints pretty-typed-HTML', function() {

		var options = this.options(),
				lang = options.lang || 'ru',
				hang = options.hang || true,
				abbr = options.abbr || true,
				halfSpace = options.halfSpace || true,
				styles = options.styles || 'inline',
				abbrClassName = options.abbrClassName || 'smallcapitals',
				hangClassName = options.hangClassName || ['hp_quote_space', 'hp_quote', 'hp_bracket_space', 'hp_bracket'],
				halfSpaceClassName = options.halfSpaceClassName || 'halfspace';
		
		// after this words we have to set nobreak space
		// sorry, will add English soon
		var words = [
			'в течение', 'накануне', 'в ходе', 'в', 'из', 'изо', 'к', 'ко', 'у', 'по',	'из-за', 'по-над', 'под', 'подо', 'около', 'вокруг', 'перед', 'возле', 'до', 'через', 'с', 'от', 'ото', 'со', 'за', 'из-за', 'благодаря', 'ввиду', 'вследствие', 'для', 'ради', 'о', 'об', 'обо', 'про', 'насчет', 'и', 'не', 'над', 'при', 'на', 'да', 'не только', 'но', 'также', 'тоже', 'ни', 'как', 'так', 'а', 'зато', 'однако', 'же', 'все', 'всё', 'или', 'либо', 'то', 'ли', 'что', 'чтобы', 'когда', 'лишь', 'едва', 'дабы', 'если бы', 'если', 'коли', 'хотя', 'хоть', 'пускай', 'пусть', 'как будто', 'будто', 'словно', 'пока', 'г.', 'обл.', 'ул.', 'пр.', 'кв.', 'ш.', 'пер.', '§', 'я', 'ты', 'мы', 'вы', 'он', 'она', 'оно', 'они', 'это', 'эта', 'этот', 'эти', 'этому', 'этой', 'чем', 'тем'
		];
		
		var capitals = [], allcaps = [], titleContent;
		var wln = words.length;
		
		var abbrTemplateStart = '<abbr style="font-size: 0.875em; letter-spacing: 0.15em; margin-right: -0.15em;">',	
				abbrTemplateEnd = '</abbr>',
				halfSpaceNobreakStart = '<nobr data-typo-nobr>',
				halfSpaceNobreakEnd = '</nobr>',
				halfSpaceTemplate = '<span style="width:0.15em; margin:0; display:inline-block; white-space:nowrap;"> </span>',
				hangTemplateQuote = '<span style="margin-right: 0.5em;"> </span><span style="margin-left: -0.5em;">«</span>',
				hangTemplateBracket = '<span style="margin-right: 0.3em;"> </span><span style="margin-left: -0.3em;">(</span>';
		
		
		if (abbr && styles !== 'inline') {
			abbrTemplateStart = '<abbr class="'+abbrClassName+'">';
		}
		
		if (hang && styles !== 'inline') {
			hangTemplateQuote = '<span class="'+hangClassName[0]+'"> </span><span class="'+hangClassName[1]+'">«</span>';
			hangTemplateBracket = '<span class="'+hangClassName[2]+'"> </span><span class="'+hangClassName[3]+'">(</span>';
		}
		
		if (halfSpace && styles !== 'inline') {
			halfSpaceTemplate = '<span class="'+halfSpaceClassName+'"> </span>';
		}
		
		// in start or uppercase
		for (var m = 0; m < wln; ++m) {
			capitals[m] = words[m].slice(0, 1).toUpperCase() + words[m].slice(1);
			allcaps[m] = words[m].toUpperCase();
		}
		
		var newWords0 = words.concat(capitals);
		var newWords = newWords0.concat(allcaps);
		var nwl = newWords.length;
		


		// punctuation
		var punctuationFrom = [' - ', ' -- '];
		var punctuationTo = [' — ', ' — '];



		this.files.forEach(function(f) {

			var src = f.src.filter(function(filepath) {
				
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {return true;}
				
			}).map(function(filepath) {
				
				return grunt.file.read(filepath);
				
			});
			


			// remove multistring
			src = src.toString();
			src = src.split('\r').join('');
			
			
			
			// remember <title> content
			titleContent = src.substring(src.indexOf('<title>'), src.indexOf('</title>')).replace('<title>','');
			
			
			
			// nobreak spaces
			for (var i = 0; i < nwl; ++i) {
				var regexp = ' '+newWords[i]+' ';
				src = src.split(regexp).join(' '+newWords[i]+' ');
			}
			
			
			
			// punctuation (no quotes yet)
			var pl = punctuationFrom.length;
			
			for (var j = 0; j < pl; ++j) {
				var spliter = punctuationFrom[j];
				var glue = punctuationTo[j];
				src = src.split(spliter).join(glue);
			}
			
			
				
			// sepc chars
			var copy = "©",
					reg = "®",
					ndash = "–",
					amp = "&";
			
			src = src.replace(/&/g, amp);
			src = src.replace(/\(c\)/g, copy);
			src = src.replace(/\(C\)/g, copy);
			src = src.replace(/\(с\)/g, copy);
			src = src.replace(/\(С\)/g, copy);
			src = src.replace(/\(r\)/g, reg);
			src = src.replace(/\(R\)/g, reg);
			
					
					
			// quotes (some magic from http://erlang.kirillpanfilov.com/devanagari/?q=devanagari.rhtml )
			src = src.replace(/«|»|„|“|”/g,'"');
			
			var srctmp = new RegExp('( | )"\\.', 'g');
			src = src.replace(srctmp,'".');
			
			srctmp = new RegExp("(^| | |\\()\"", "g");
			src = src.replace(srctmp,"$1«");
			srctmp = new RegExp("\"($| | |\.|,|!|\\?|:|;|\\))", "g");
			src = src.replace(srctmp,"»$1");
			src = src.replace(/«\)/g,"»)");
			
			srctmp = new RegExp("«( | )", "g");
			src = src.replace(srctmp,"«");
			srctmp = new RegExp("( | )»", "g");
			src = src.replace(srctmp,"»");
			src = src.replace(/>»([^ \\.,!\\?:;])/g,">«$1");
			
			src = src.replace(/( ?)=( ?)(«|»|„|“|"|')( ?)([^>«»„“"']*)( ?)(«|»|„|“|"|')/ig,'="$5"');
			
			var whi=0;
			while(whi<50) {
				src = src.replace(/style="([^"]*): ([^"]*)"/ig,'style="$1:$2"');
				whi++;
			}
			
			src = src.replace(/ "/g,'"');
			
			// inner quotes
			src = src.replace(/«»/g,'««');
		
			var whi1=0;
			while(whi1<30) {
				src = src.replace(/«([^«»]*)«([^«»]*)»/g,"«$1„$2“");
				whi1++;
			}
			
			src = src.replace(/“"/g,'“»');
			
			
					
			// mdash in number-ranges (not in phone numbers)
			srctmp = new RegExp("([0-9]+)( | )?—( | )?([0-9]+)", "g");
			src = src.replace(srctmp,"$1–$4");
			src = src.replace(/([0-9]+)-([0-9]+)/g,"$1–$2");
			srctmp = new RegExp("([0-9]{1,3})–([0-9]{2})-([0-9]{2})", "g");
			src = src.replace(srctmp,"$1-$2-$3");
			
			
			
			// hang punctuation
			if (hang) {
				src = src.replace(/«/g, hangTemplateQuote);
				src = src.replace(/\(/g, hangTemplateBracket);
			}
			
			
			
			// abbreviations
			if (abbr) {
				var abbrReg = new RegExp('([А-ЯЁA-Z]{2,})(?![а-яёА-ЯЁ\\w*\\s*\\d*\\]*]*"?[\\s*\\w*]*>)(?=.*\\n*\\t*<)', 'g');
				src = src.replace(abbrReg, abbrTemplateStart + '$1' + abbrTemplateEnd);
				// nobreak space
				src = src.split(' '+abbrTemplateStart).join(' '+abbrTemplateStart);
				src = src.split('. '+abbrTemplateStart).join('. '+abbrTemplateStart);
			}
			
			
			
			// halfspace in numbers
			function replacer(str, p1, p2, offset, s) {
				return str.replace(/(\d)(?=(\d\d\d)+([^\d]))/g, '$1' + halfSpaceTemplate);
			}
			
			if (halfSpace) {
				// wrap them into nobr and separate currency
				var nobrReg = new RegExp('(\\>.*\\b)(\\d{4,})([\$|\€|\₽|\£])*(\\w*\\<)', 'g');
				src = src.replace(nobrReg, '$1'+halfSpaceNobreakStart+'$2'+halfSpaceTemplate+'$3'+halfSpaceNobreakEnd+'$4');
				// separate digits
				var sepReg = new RegExp('('+halfSpaceNobreakStart+')(\\s*\\S*)', 'g');
				src = src.replace(sepReg, replacer);
			}
			
			
			
			// remove double spaces
			src = src.replace('\s{2}', ' ');
			
			
			
			// return <title> content
			var cnts1 = src.split('<title>');
			var cnts2 = cnts1[1].toString().split('</title>');
			src = cnts1[0] + '<title>' + titleContent + '</title>' + cnts2[1];


			
			// finish
			grunt.file.write(f.dest, src);
			grunt.log.writeln('File "' + f.dest + '" created.');
			
		});
	});

};
