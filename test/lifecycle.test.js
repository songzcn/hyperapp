import { h, app } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", done => {
  const view = () =>
    h(
      "div",
      {
        oncreate(element) {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
          done()
        }
      },
      "foo"
    )

  app({}, view)
})

test("onupdate", done => {
  const model = {
    state: { value: "foo" },
    actions: {
      repaint: () => ({})
    }
  }

  const view = state => actions =>
    h(
      "div",
      {
        class: state.value,
        oncreate() {
          actions.repaint()
        },
        onupdate(element, oldProps) {
          expect(element.textContent).toBe("foo")
          expect(oldProps.class).toBe("foo")
          done()
        }
      },
      state.value
    )

  app(model, view)
})

test("onremove", done => {
  const model = {
    state: {
      value: true
    },
    actions: {
      toggle: () => state => ({ value: !state.value })
    }
  }

  const view = state => actions =>
    state.value
      ? h(
          "ul",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                "<ul><li></li><li></li></ul>"
              )
              actions.toggle()
            }
          },
          [
            h("li"),
            h("li", {
              onremove(element, remove) {
                remove()
                expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                done()
              }
            })
          ]
        )
      : h("ul", {}, [h("li")])

  app(model, view)
})

test("event bubling", done => {
  let count = 0

  const model = {
    state: {
      value: true
    },
    actions: {
      toggle: () => state => ({ value: !state.value })
    }
  }
  
  const view = state => actions =>
    h(
      "main",
      {
        oncreate() {
          expect(count++).toBe(3)
          actions.toggle()
        },
        onupdate() {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        h("p", {
          oncreate() {
            expect(count++).toBe(2)
          },
          onupdate() {
            expect(count++).toBe(6)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(1)
          },
          onupdate() {
            expect(count++).toBe(5)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(0)
          },
          onupdate() {
            expect(count++).toBe(4)
          }
        })
      ]
    )

  app(model, view)
})
