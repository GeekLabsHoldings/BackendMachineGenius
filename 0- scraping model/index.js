const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio')

const app = express()
const port = 1400
const url = "https://www.thestar.com/politics/"
// const url = "https://www.theglobeandmail.com/politics/"
// const url = "https://nationalpost.com/category/news/politics"
// const url = "https://x.com/Cristiano?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
// const url = "https://www.reddit.com/search/?q=articles&type=link&cId=46852a1a-3587-44ae-bacb-3242475d8109&iId=b25e2708-bf51-4428-a3f1-34de123716d1"
// const url = "https://en.wikipedia.org/wiki/U.S._state"

let articles = []

const fetchData = async() =>
{
  try
  {
    let res = await axios.get(url)
    let $ = await cheerio.load(res.data)
    $
    (
      "#block-2827353 > div.storyPack.pack18.card-img-md.region-bg"
      // "#main-content > div.l-grid.l-grid--main > div > div.l-grid.l-grid-article-list > div.article-list-grid-wrap > div > div > a > div.c-card__content > div.c-card__hed"
      // "#\\36 196fd704405c6686f9fc7de3a6eae1c > li:nth-child(1) > article > div > div.article-card__details > a > h3 > span"
      // "#id__5vst01mluz2 > span:nth-child(1)"
      // "#main-content > div > reddit-feed > faceplate-tracker:nth-child(1) > post-consume-tracker > div > faceplate-tracker > h2 > a"
      // "#mw-content-text > div.mw-content-ltr.mw-parser-output > div.div-col > div > ul >li"
    ).each((i, e)=>
    {
      articles.push($(e).text().trim())
      console.log("trimmed")
    })
  }
  catch(e)
  {
    console.log(e)
  }
}
fetchData()
app.get("/scraper" , (req,res) => 
{

  res.json({articles})
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});