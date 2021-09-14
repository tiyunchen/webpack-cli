module.exports = function(source){
    let option = this.query;
    let defaultWidth = "1000px";
    if(option&&option.MAXWIDTH){
        defaultWidth = option.MAXWIDTH+"px";
    }
    source = source.replace(`$MAX_SCREEN_WIDTH:100%;`,`$MAX_SCREEN_WIDTH:${defaultWidth};`);
    return source;
}