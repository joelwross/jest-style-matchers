const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio')
const stylelint = require('stylelint');
const inlineCss = require('inline-css'); //for css testing
const md5 = require('md5');

//load the HTML file, since we're gonna need it.
const html = fs.readFileSync('problem2/index.html', 'utf-8');
//absolute path for relative loading (if needed)
const baseDir = 'file://'+path.dirname(path.resolve('problem2/index.html'))+'/';

describe('Source code is valid', () => {
  test('CSS validates without errors', async () => {
    let cssValidityObj = await stylelint.lint({files:'problem1/css/style.css'});
    expect(cssValidityObj).cssLintResultsContainsNoErrors();
  })

  test('HTML has not been modified', () => {
    let nospace = html.replace(/\s/g, ''); //strip all whitespace to account for platform modifications
    expect(md5(nospace)).toBe('b52e5621c7c32dbc25348f6b2552b611');    
  });
});


describe('Includes required CSS rules', () => {
  let $; //cheerio instance
  let node; //current node
  beforeAll(async () => {
    //test CSS by inlining properties and then reading them from cheerio
    let inlined = await inlineCss(html, {url:baseDir, removeLinkTags:false});
    $ = cheerio.load(inlined);
    //console.log(inlined);
    node = $('svg').children().first();
  })

  test('1. Circles are filled gray', () => {
    node = node.next();
    expect(node.css('fill').toLowerCase()).toEqual('#5f5f5f');
    node = node.next(); //both circles
    expect(node.css('fill').toLowerCase()).toEqual('#5f5f5f');
  })

  test('2. Paths have stroke', () => {
    node = node.next();
    expect(node.css('stroke').toLowerCase()).toEqual('#5f5f5f');
    expect(node.css('stroke-width')).toEqual('8px');
    node = node.next(); //both paths
    expect(node.css('stroke').toLowerCase()).toEqual('#5f5f5f');
    expect(node.css('stroke-width')).toEqual('8px');
  })

  test('3. Circles are filled white', () => {
    node = node.next();
    expect(node.css('fill').toLowerCase()).toEqual('white');
    node = node.next(); ///both circles
    expect(node.css('fill').toLowerCase()).toEqual('white');
  })

  test('4. Circles are filled brown', () => {
    node = node.next(); //g
    let circle = node.children().first();    
    expect(circle.css('fill').toLowerCase()).toEqual('#573d29');
    circle = circle.next(); //both circles
    expect(circle.css('fill').toLowerCase()).toEqual('#573d29');
  })

  test('5. Circle and rect are filled light gray', () => {
    node = node.next(); //g
    let circle = node.children().first();    
    expect(circle.css('fill').toLowerCase()).toEqual('#c0c0c0');
    let rect = circle.next(); //both elements
    expect(rect.css('fill').toLowerCase()).toEqual('#c0c0c0');
    //rect should not be transparent
    expect(rect.css('opacity')).not.toEqual('0');

    //should confirm single rule use?
  })

  test('6. Path is filled gray with red stroke', () => {
    node = node.next();
    expect(node.css('fill').toLowerCase()).toEqual('#c0c0c0');
    expect(node.css('stroke').toLowerCase()).toEqual('#bd250d');
    expect(node.css('stroke-width')).toEqual('4px');
  })

  test('7. Path is color changes on hover (no test)', () => {
    //console.log('No test for this requirement');
    //TODO: Add AST tree browsing to confirm presence of rule?
  })

  test('8. Rectangles have opacity of 0', () => {
    node = node.next(); //skip the <use> tag

    node = node.next(); //check all 3
    expect(node.css('opacity')).toEqual('0');
    node = node.next();
    expect(node.css('opacity')).toEqual('0');
    node = node.next();
    expect(node.css('opacity')).toEqual('0');
  })

  test('9. Path has no stroke', () => {
    node = node.next();
    let removed = (node.css('stroke') == 'none') || /^0(px)?$/.test(node.css('stroke-width'));
    expect(removed).toBe(true);
  })
})


//Custom code validation matchers (for error output)
expect.extend({
  //using stylelint errors
  cssLintResultsContainsNoErrors(validityObj) {
    const pass = validityObj.errored === false;
    if(pass){
      return { pass:true, message:() => "expected CSS to contain validity errors" };
    }
    else {
      return { pass: false, message:() => (
        //loop through and build the result string
        JSON.parse(validityObj.output)[0].warnings.reduce((out, msg) => {
          return out + `${msg.severity}: ${msg.text}\n       At line ${msg.line}, column ${msg.column}.\n`
        }, '')
      )};
    }
  }
});