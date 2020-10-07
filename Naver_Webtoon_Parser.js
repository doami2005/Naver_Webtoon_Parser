function ParseWebtoon (name, count, linktf) {
    if (count && (isNaN(count) || count<1)) return "Count is out of limit.";
    let web = Jsoup.connect("https://m.comic.naver.com/search/result.nhn?keyword=" + name).get().select(".lst");
    if (!web.size()) return "No Webtoon called " + name;
    id = web.select("a").attr("href").split("=")[1];
    let url = "https://m.comic.naver.com/webtoon/list.nhn?titleId=" + id;
    if (!count) {
        count = Number(Jsoup.connect(url).get().select("li.item").toArray()
        .filter(e => !e.select("span.score").isEmpty())[0]
        .select("a").attr("href").split("&")[1].substr(3));
    }
    let all = Array(count).fill().map((e, i) => {
        let url2 = "https://m.comic.naver.com/webtoon/detail.nhn?titleId=" + id + "&no=" + (i+1) + "&listSortOrder=DESC&listPage=1";
        parse = Jsoup.connect(url2).get();
        imgs = parse.select("li").toArray()
        .filter(e => !e.select("img").isEmpty() && e.select("img").attr("data-src"))
        .map(e => e.select("img").attr("data-src")).join(",");
        if (!linktf) {
            link = Jsoup.connect("http://doami.dothome.co.kr/WebtoonParser.php")
            .data("imgs", imgs).post().text();
            return link;
        } 
        return imgs;
    });
    return all;
}
