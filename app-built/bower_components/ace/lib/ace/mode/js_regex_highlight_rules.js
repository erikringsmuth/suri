define(["require","exports","module","../lib/oop","./text_highlight_rules"],function(e,t,n){var r=e("../lib/oop"),i=e("./text_highlight_rules").TextHighlightRules,s="\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",o="({\\d+\\b,?\\d*}|[+*?])(\\??)",u=function(){this.$rules={start:[{token:"keyword",regex:"\\\\[bB]",next:"no_quantifier"},{token:"regexp.keyword.operator",regex:s},{token:"string.regexp",regex:"/\\w*",next:"start"},{token:["string","string.regex"],regex:o,next:"no_quantifier"},{token:"keyword",regex:"[$^]|\\\\[bB]",next:"no_quantifier"},{token:"constant.language.escape",regex:/\(\?[:=!]|\)|[()$^+*?]/,next:"no_quantifier"},{token:"constant.language.delimiter",regex:/\|/,next:"no_quantifier"},{token:"constant.language.escape",regex:/\[\^?/,next:"character_class"},{token:"empty",regex:"$",next:"start"}],character_class:[{regex:/\\[dDwWsS]/},{token:"markup.list",regex:"(?:"+s+"|.)-(?:[^\\]\\\\]|"+s+")"},{token:"keyword",regex:s},{token:"constant.language.escape",regex:"]",next:"start"},{token:"constant.language.escape",regex:"-"},{token:"empty",regex:"$",next:"start"},{defaultToken:"string.regexp.charachterclass"}],no_quantifier:[{token:"invalid",regex:o},{token:"invalid",regex:"",next:"start"}]}};r.inherits(u,i),t.JsRegexHighlightRules=u});