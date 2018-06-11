const fs = require('fs');
const cheerio = require('cheerio')

//load the HTML file, since we're gonna need it.
const htmlPath = __dirname + '/index.html';
const cssPath = __dirname + '/css/style.css';
const html = fs.readFileSync(htmlPath, 'utf-8');

//my custom matchers
const styleMatchers = require('../index.js');
expect.extend(styleMatchers);


describe('Source code is valid', () => {
  test('HTML validates without errors', async () => {
    const lintOpts = {
      'attr-bans':['align', 'background', 'bgcolor', 'border', 'frameborder', 'marginwidth', 'marginheight', 'scrolling', 'style', 'width', 'height'], //adding height, allow longdesc
      'doctype-first':true,
      'doctype-html5':true,
      'html-req-lang':true,
      'line-end-style':false, //either way
      'indent-style':false, //can mix/match
      'indent-width':false, //don't need to beautify
      'class-style':'none', //I like dashes in classnames
      'img-req-alt':false, //for this test; captured later!
    }

    await expect(htmlPath).toHaveNoHtmlLintErrorsAsync(lintOpts);
  })

  test('CSS validates without errors', async () => {

    await expect(cssPath).toHaveNoCssLintErrorsAsync({
      rules:{
        "declaration-colon-space-after": "always",
      }
    });

    // let cssValidityObj = await stylelint.lint({files:'problem1/css/style.css'});
    // expect(cssValidityObj).cssLintResultsContainsNoErrors();
  })

});

let $; //cheerio instance
beforeAll(() => {
  $ = cheerio.load(html);
})

describe('Has appropriate headings', () => {
  test('Headings are meaningful', () => {
    expect($('h6').length).toEqual(0); //get rid of h6s
    expect($('.time-posted').length).toEqual(3); //should have 3 of these
  });

  test('Headings are hierarchical', () => {
    //don't have implemantation for outline algorithm
    //just check counts for now
    let h1 = $('h1');
    expect( $('h1').length ).toEqual(1);
    expect( $('h2').length ).toEqual(3);
    expect( $('h3').length ).toEqual(0);
  });
})

describe('Include semantic sectioning elements', () => {
  test('Has header, main, foot sections', () => {
    let bodyChildren = $('body').children();
    expect(bodyChildren.length).toEqual(3);
    expect(bodyChildren[0].tagName).toMatch('header');
    expect(bodyChildren[1].tagName).toMatch('main');
    expect(bodyChildren[2].tagName).toMatch('footer');
  })

  test('Has appropriate sections', () => {
    let mainChildren = $('main').children();
    expect(mainChildren.length).toEqual(3); //3 blog posts, three sections

    let postTitles = ["Check it out!", "How I did it", "A blog post!"];    
    mainChildren.each(function(i){
      //section or article valid, but section is better
      expect($(this)[0].tagName).toMatch(/(section)|(article)/);

      //should only contain post title, not titles of other posts
      let text = $(this).text();
      expect(text).toMatch(postTitles[i]); //should contain this title, but not others
      expect(text).not.toMatch(new RegExp('('+postTitles[(i+1)%3]+'|'+postTitles[(i+2)%3]+')'));
    });
  })

  test('Blog post times are annotated', () => {
    //look for <time> tags and make sure they are correct :)
    let times = $('time');
    expect(times.length).toEqual(3); //change times on 3 blog posts

    times.each(function(i){
      let timestamp = $(this).attr('datetime');
      expect(String(new Date(timestamp))).not.toMatch('Invalid Date'); //should be valid
    })

  })
})

describe('First post has accessible images', () => {
  test('Image has alternative test', () => {
    let alt = $('img').attr('alt');
    expect(alt).toBeDefined();
    expect(alt.length).toBeGreaterThan(3);
    expect(alt).not.toMatch(/an (image|picture) of/i);
  })

  test('Figure is captioned', () => {
    let figure = $('img').parent('figure');
    expect(figure.length).toEqual(1); //should have figure
    let figcap = figure.children('figcaption');
    expect(figcap.html()).toMatch(new RegExp('Bizzard, the pup, by Frank Harvey. From the <a href="https://www.flickr.com/photos/statelibraryofnsw/2959326615/">State Library of NSW</a>.'));
    expect(figcap.children('cite').length).toEqual(1);
  })
})

describe('Second post describes code', () => {
  test('Abbreviations are annotated', () => {
    let abbr = $('abbr');
    expect(abbr.length).toBeGreaterThanOrEqual(2);
    let abbrHtml = abbr.slice(0,1);
    expect(abbrHtml.text()).toMatch('HTML');
    expect(abbrHtml.attr('title')).toMatch('HyperText Markup Language');
    let abbrCss = abbr.slice(1,2);
    expect(abbrCss.text()).toMatch('CSS');
    expect(abbrCss.attr('title')).toMatch('Cascading Style Sheets');
  })

  test('HTML code example is displayed', () => {
    //one check that it's formatted right
    expect($('code').html()).toEqual('&lt;h1&gt;Hello World&lt;/h1&gt;');
  })

  test('CSS components described in descriptive list', () => {
    let dl = $('dl');
    expect(dl.length).toEqual(1); //should have a dl
    let dt = $('dl > dt'); //need to be immediate children
    let dd = $('dl > dd');
    expect(dt.eq(0).html()).toEqual('Selectors');
    expect(dt.eq(1).html()).toEqual('Properties');
    expect(dd.eq(0).html()).toMatch(/Let you say which tags you want to style/i);
    expect(dd.eq(1).html()).toMatch(/Let you say what style you want to make those tags/i);    
  })
})

describe('Footer is semantically accurate', () => {
  test('Contact info annotated', () => {
    let address = $('address');
    expect(address.length).toEqual(1);
    expect(address.parent('footer').length).toEqual(1); //should be in footer
    expect(address.html()).toMatch(/Contact me at/);
    expect(address.html()).not.toMatch(/&copy; 2017 The Author./);
    expect(address.html()).not.toMatch(/This blog was/);
    expect(address.html()).not.toMatch(/UW Information School/); //not the first one!    
  })

  test('Email has a link', () => {
    let mail = $('a[href="mailto:me@here.com"]');
    expect(mail.length).toEqual(1);
    expect(mail.html()).toEqual('me@here.com')
  })

  test('Telephone number has a link', () => {
    let tel = $('a[href="tel:555-123-4567"]');
    expect(tel.length).toEqual(1);
    expect(tel.html()).toEqual('(555) 123-4567');
  })
})
