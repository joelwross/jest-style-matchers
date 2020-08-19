# Problem 1

In this exercise, you'll practice editing HTML to be more **accessible** by using semantic elements.

To complete the exercise, modify the included `index.html` file (which displays a simple blog) based on the below instructions. You will **not** need to modify the CSS (which has been included to make the page a little nicer... and to give some visual hints when you're on the right track!).

In particular, you should make the following changes:

- Ensure that heading elements (e.g., `<h1>`, `<h2>`) are used appropriately: they should be **meaningful** (for actual headings, not just for styling) and **hierarchical** (in order).

  - You should use the CSS classes defined in `css/style.css` to apply styling to elements, instead of inappropriately using headings.

- Add _semantic sectioning_ elements to appropriately organize the document, including `<header>`, `<main>`, `<footer>`, `<section>`, etc. These will also provide ARIA navigation landmarks.

- Each blog post has an element indicating the time it was posted. These times are _relative_ (e.g., "yesterday"). [Mark up](https://css-tricks.com/time-element/) these times to make them machine readable (e.g., for search engine optimization). Note that the markup should indicate that "today" is today's date, "yesterday" is yesterday's date, etc.

- The first blog post contains an image. Make sure that this image has a description that is properly read by screen readers. Additionally, make the paragraph below the image describing it into a proper [caption](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption).

  - The caption describes the image source. Include [markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite) to make this citaton semantic.

- The second blog post talks about writing code, but could use some help to make it look and read correctly:

  - Add [markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr) to the abbreviations the first time they are used, explaining what they stand for (this will let you "mouse over" the text to see the expansion in some browsers).

  - The post tries to show some HTML code, but it doesn't render correctly. Use [HTML Character Entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity) to render the HTML tag as text. Additionally, add [markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code) to indicate that this is computer code.

  - The CSS rule components (_Selectors_ and _Properties_) are listed with descriptions... so would more appropriately be structured as a [description list](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Define_terms_with_HTML#How_to_build_a_description_list) (`dl`). Note that each "item" in a description list is actually two tags: a _term_ (`dt`) and a _description_ (`dd`).

- Contact information (such as at the bottom of the page) should be given appropriate [appropriate markup](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/address). Note that addresses that are _not_ contact information for this particular document or article require no special markup.

  - Additionally, make sure that [email](https://css-tricks.com/snippets/html/mailto-links/) and [telephone](https://css-tricks.com/the-current-state-of-telephone-links/) number are both links with proper URI protocols!

## Testing

This exercise includes a set of unit tests to help check your work. You can run the test suite using

```bsh
jest problem1
```
