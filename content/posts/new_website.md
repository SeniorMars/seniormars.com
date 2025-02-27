+++
title = "New Website!"
date = "2023-03-31"
description = "A guy writes a blog about how his new website looks."
updated = "2024-06-15"

[extra]
comment = true

[taxonomies]
tags=["meta"]
+++

So, I guess I have a blog now! It uses [Zola](https://www.getzola.org/) and is hosted on [GitHub Pages](https://pages.github.com/). The theme is custom, but it is based on the [Apollo theme](https://github.com/not-matthias/apollo). Plus Ayu-dark for codeblocks.

Here is my fork: [Redux](https://github.com/seniormars/redux).

---

# Mermaid

{% mermaid() %}
graph LR
    A[Start] --> B[Initialize]
    B --> C[Processing]
    C --> D[Complete]
    D --> E[Success]
    
    style A fill:#f9f,stroke:#333
    style E fill:#9f9,stroke:#333
{% end %}


## LaTeX

### Inline Math

-   $(a+b)^2$ = $a^2 + 2ab + b^2$
-   A polynomial P of degree d over $\mathbb{F}_p$ is an expression of the form
    $P(s) = a_0 + a_1 . s + a_2 . s^2 + ... + a_d . s^d$ for some
    $a_0,..,a_d \in \mathbb{F}_p$

### Displayed Math

$$
p := (\sum_{k∈I}{c_k.v_k} + \delta_v.t(x))·(\sum_{k∈I}{c_k.w_k} + \delta_w.t(x)) − (\sum_{k∈I}{c_k.y_k} + \delta_y.t(x))
$$


## Quote

> The enjoyment of one's tools is an essential ingredient of successful work.
> - <cite> Donald Knuth</cite>


# H1
## H2
### H3


Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet sagittis id consectetur purus ut. In pellentesque massa placerat duis ultricies. Neque laoreet suspendisse interdum consectetur libero id. Justo nec ultrices dui sapien eget mi proin. Nunc consequat interdum varius sit amet mattis vulputate. Sollicitudin tempor id eu nisl nunc mi ipsum. Non odio euismod lacinia at quis. Sit amet nisl suscipit adipiscing. Amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Sit amet consectetur adipiscing elit pellentesque habitant. Ac placerat vestibulum lectus mauris. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed. [Google](https://www.google.com)

![Markdown Logo](https://markdown-here.com/img/icon256.png)

## Code Block

```rust
fn main() {
    println!("Hello World");
}
```


```rust,hl_lines=2,linenos
fn main() {
    println!("Hello World");
}
```

## Ordered List

1. First item
2. Second item
3. Third item

## Unordered List

- List item
- Another item
- And another item

## Nested list

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese


## Table Inline Markdown

| Italics   | Bold     | Code   | StrikeThrough     |
| --------  | -------- | ------ | ----------------- |
| *italics* | **bold** | `code` | ~~strikethrough~~ |

## Foldable Text

<details>
    <summary>Title 1</summary>
    <p>IT'S A SECRET TO EVERYBODY.</p>
</details>

<details>
    <summary>Title 2</summary>
    <p>Stay awhile, and listen!</p>
</details>

## Code tags

Lorem ipsum `dolor` sit amet, `consectetur adipiscing` elit. 
`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`

## Testing
 
Here is an example of the `note` shortcode:

This one is static!
{{ note(header="Note!", body="This blog assumes basic terminal maturity") }}

This one is clickable!
{{ note(clickable=true, header="Quiz!", body="The answer to the quiz!") }}


Syntax:
```
{{/* note(header="Note!", body="This blog assumes basic terminal maturity") */}}
{{/* note(clickable=true, header="Quiz!", body="The answer to the quiz!") */}}
```

You can also use some HTML in the text:
{{ note(header="Note!", body="<h1>This blog assumes basic terminal maturity</h1>") }}


Literal shortcode:
```
{{/* note(header="Note!", body="<h1>This blog assumes basic terminal maturity</h1>") */}}
```

Pretty cool, right?

Finally, you can do something like this (hopefully):

{% note(clickable=true, header="Quiz!") %}

# Hello this is markdown inside a note shortcode

```rust
fn main() {
    println!("Hello World");
}
```

We can't call another shortcode inside a shortcode, but this is good enough.

{% end %}

Here is the raw markdown:

````markdown
{{/* note(clickable=true, header="Quiz!") */}}

# Hello this is markdown inside a note shortcode

```rust
fn main() {
    println!("Hello World");
}
```

We can't call another shortcode inside a shortcode, but this is good enough.

{{/* end */}}
````



| Cartesian Closed Category | $\mathbf{Set}$ | $\mathbf{P}$ (Logic) | Typed $\lambda$-calculus |
|---------------------------|---------|---------------|------------------|
| Objects/1-cells | Sets | Propositions | Types |
| Morphisms/2-cells | Functions | Entailment | Terms/Programs |
| 1-cell composition | Cartesian product $S \times T$ | Conjunction $A \wedge B$ | Product type |
| Identity 1-cell | One-element set $\{*\}$ | True proposition $\top$ | Unit type $()$ |
| Right Kan extension | Function set $T^S$ | Implication $A \rightarrow B$ | Function type |
| Evaluation morphism | Function application | Modus ponens | Term application |
| Currying | $f: C\times A\rightarrow B$ to $\Lambda f: C\rightarrow B^A$ | Deduction theorem | Lambda abstraction |

### Basic Note Types

{{ note(type="default", header="Default Note", body="This is a standard note with default styling.") }}

{{ note(type="info", header="Information Note", body="This note contains important information you should know.") }}

{{ note(type="warning", header="Warning Note", body="Be careful! This note warns you about something important.") }}

{{ note(type="success", header="Success Note", body="Congratulations! This operation was successful.") }}

{{ note(type="danger", header="Danger Note", body="Critical error! Something went seriously wrong.") }}

{{ note(type="tip", header="Tip Note", body="Here's a useful tip to make your work easier.") }}

### Custom Icons

{{ note(type="info", icon="📌", header="Custom Icon", body="This note uses a custom pin icon instead of the default info icon.") }}

{{ note(type="warning", icon="🔥", header="Fire Warning", body="This warning uses a fire emoji as its custom icon.") }}

{{ note(type="success", icon="🌟", header="Star Success", body="A star icon celebrates this success message.") }}

### Clickable Notes (Collapsible)

{{ note(clickable=true, header="Click to Expand", body="This content can be toggled by clicking the header.") }}

{{ note(clickable=true, hidden=true, header="Hidden Content (Click to Show)", body="This content is initially hidden but can be revealed.") }}

{{ note(clickable=true, type="tip", header="Expandable Tip", body="This tip is in a collapsible block.") }}

### Center Alignment

{{ note(center=true, header="Centered Header", body="This note has a centered header.") }}

{{ note(center=true, type="success", header="Centered Success", body="This success note has a centered header.") }}

{{ note(clickable=true, center=true, header="Centered & Clickable", body="This note has both center alignment and is clickable.") }}

### Rich Content Examples

{{ note(type="info", header="Rich Content", body="This note includes **bold text**, *italic text*, and `inline code`.") }}

{{ note(type="warning", header="Warning with List", body="Things to watch out for:\n\n1. First issue\n2. Second issue\n3. Third issue") }}

### Tables Inside Notes

{% note(type="info", header="Data Table!") %}

| Name | Age | Role | Height |
|------|-----|------|--------|
| Alice | 28 | Developer | 5'6" |
| Bob | 34 | Designer | 6'1" |
| Carol | 42 | Manager | 5'8" |

{% end %}

It works good enough for me!
