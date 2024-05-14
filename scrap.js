import puppeteer from 'puppeteer';
import fs from 'fs'
import cheerio from 'cheerio';


function getLink(html){
  const $ = cheerio.load(html);
  const linkHref = $('a').attr('href');
  return linkHref


}





(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL https://www.google.com/maps/search/cake+bakery+delhi/   ttps://www.google.com/maps/search/restaurants+in+australia/
  await page.goto('https://www.google.com/maps/search/cake+bakery+delhi/');
  await page.setViewport({width: 1080, height: 1823});
  


  setTimeout(async function() {
    await page.screenshot({ path: 'screenshotw.png' });
    const divElement = await page.$('div.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd');
    

    const titleTag = await page.$$eval('div.Nv2PK.THOPZb', divs => {
      return divs.map(div => div.outerHTML);
    });
    console.log(titleTag.length)
    let listdata = []
    for (let index = 0; index < titleTag.length; index++) {
      const element2 = titleTag[index];
       let link = getLink(element2)
       await page.goto(link);
        // await page.setViewport({width: 1080, height: 1823});
        await page.setViewport({width: 1080, height: 500});
        
        
        // const div = await page.$eval('div.TIHn2', div => div.outerHTML);
         
        const div = await page.$eval('div[role="main"]', div => div.outerHTML);
        // console.log(div)
        const $ = cheerio.load(div);
        const ariaHiddenValue = $('span').attr('aria-hidden',true).eq( 2 );
        const address =  $('div.Io6YTe.fontBodyMedium.kR99db').first();
        const menu =$('a.CsEnBe').eq(1).attr('href');
        const website = $('a.CsEnBe').eq(2).attr('href');
        // const phone = $('div.Io6YTe.fontBodyMedium.kR99db ').eq(5) 3
        // const phone = $('div.Io6YTe.fontBodyMedium.kR99db').eq(4)
        const regex =/^([0-9]){8,}/
        // console.log(regex.test($('div.Io6YTe.fontBodyMedium.kR99db').eq(4)))
        const phone =  regex.test($('div.Io6YTe.fontBodyMedium.kR99db').eq(4).text().replace(/\s+/g, '')) ? $('div.Io6YTe.fontBodyMedium.kR99db').eq(4).text().replace(/\s+/g, ''): $('div.Io6YTe.fontBodyMedium.kR99db').eq(3).text().replace(/\s+/g, '')
        const h1 = $('h1').text();

        console.log("Name",h1,phone);

        // convert into object 
        let obj = {
          "Name":h1,
          "Stars": ariaHiddenValue.text(),
          "Address":address.text(),
          'Menu':menu ,
          'Website':website,
          'Phone':phone,
          

        }
        listdata.push(obj)
        // console.log("Name",h1);
        // console.log("Stars",ariaHiddenValue.text())
        // console.log("Address",address.text(),"Yes")  
        // console.log('Menu',menu);
        // console.log('Website',website)
        // console.log('Phone',phone?.text())


    }
    const jsonString = JSON.stringify(listdata);
    //writing the json
    fs.writeFile('people.json', jsonString, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('JSON data written to people.json');
    });
    
    await browser.close();
  

      
    
  }, 1000);
  

  

  

 
})();