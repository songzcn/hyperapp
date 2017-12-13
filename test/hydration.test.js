import { h, app } from "../src"

function testHydration(name, ssrBody, children, container) {
  test(name, done => {
    document.body.innerHTML = ssrBody
    const view = state =>
      h(
        "main",
        {
          onupdate() {
            expect(document.body.innerHTML).toBe(ssrBody)
            done()
          }
        },
        children
      )
    app({}, view, container && document.getElementById(container))
  })
}

beforeEach(() => {
  document.body.innerHTML = ""
})

testHydration(
  "hydrate without container",
  `<main><p>foo</p></main>`,
  [h("p", {}, "foo")],
  null
)

testHydration(
  "hydrate with container",
  `<div id="app"><main><p>foo</p></main></div>`,
  [h("p", {}, "foo")],
  "app"
)
