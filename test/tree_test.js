var Range = require("..")
var RangeTree = require("../tree")

describe("RangeTree", function() {
  describe(".prototype.search", function() {
    describe("given value", function() {
      it("must return an empty array if empty", function() {
        var tree = RangeTree.from([])
        tree.search(42).must.be.empty()
      })

      it("must return an empty array if not found within 1", function() {
        var tree = RangeTree.from([new Range(0, 10)])
        tree.search(42).must.be.empty()
      })

      it("must return an empty array if with exclusive boundary", function() {
        var tree = RangeTree.from([new Range(0, 10, "[)")])
        tree.search(10).must.be.empty()
      })

      it("must return an empty array if not found within 3", function() {
        var ranges = [new Range(0, 10), new Range(15, 25), new Range(30, 40)]
        var tree = RangeTree.from(ranges)
        tree.search(42).must.be.empty()
      })

      it("must return range if within 1", function() {
        var tree = RangeTree.from([new Range(0, 10)])
        tree.search(5).must.eql([new Range(0, 10)])
      })

      it("must return range if within 2", function() {
        var tree = RangeTree.from([new Range(0, 10), new Range(20, 30)])
        tree.search(5).must.eql([new Range(0, 10)])
        tree.search(25).must.eql([new Range(20, 30)])
      })

      it("must return range if within 3", function() {
        var ranges = [new Range(0, 10), new Range(20, 30), new Range(40, 50)]
        var tree = RangeTree.from(ranges)
        tree.search(5).must.eql([new Range(0, 10)])
        tree.search(25).must.eql([new Range(20, 30)])
        tree.search(45).must.eql([new Range(40, 50)])
      })

      it("must return range if multiple with equal begin", function() {
        var tree = RangeTree.from([
          new Range(0, 20),
          new Range(10, 25),
          new Range(15, 35),
          new Range(15, 40),
        ])

        tree.search(37).must.eql([new Range(15, 40)])
      })

      it("must return multiple ranges if within 3", function() {
        var ranges = [new Range(0, 20), new Range(15, 35), new Range(30, 40)]
        var tree = RangeTree.from(ranges)
        tree.search(35).must.eql([new Range(15, 35), new Range(30, 40)])
      })

      it("must return multiple ranges with equal begin", function() {
        // Use plenty of ranges to ensure a naive dividing tree construction
        // puts the duplicate ranges further apart.
        var tree = RangeTree.from([
          new Range(0, 20),
          new Range(10, 25),
          new Range(15, 35),
          new Range(15, 40),
          new Range(35, 40),
          new Range(35, 50)
        ])

        tree.search(30).must.eql([new Range(15, 35), new Range(15, 40)])
      })

      it("must return multiple ranges if on two sides", function() {
        var tree = RangeTree.from([
          new Range(0, 15),
          new Range(5, 5),
          new Range(10, 25)
        ])

        tree.search(13).must.eql([new Range(0, 15), new Range(10, 25)])
      })

      it("must return multiple ranges if all equal", function() {
        var tree = RangeTree.from([new Range(5, 15), new Range(5, 15)])
        tree.search(10).must.eql([new Range(5, 15), new Range(5, 15)])
      })

      it("must return multiple ranges if one equal but exclusive", function() {
        var tree = RangeTree.from([
          new Range(5, 15),
          new Range(5, 10, "[)"),
          new Range(10, 15, "(]"),
          new Range(10, 20)
        ])

        tree.search(10).must.eql([new Range(5, 15), new Range(10, 20)])
      })

      it("must return multiple ranges ordered by ascending end", function() {
        var tree = RangeTree.from([
          new Range(0, 10),
          new Range(0, 15),
          new Range(0, 5)
        ])

        tree.search(5).must.eql([
          new Range(0, 5),
          new Range(0, 10),
          new Range(0, 15)
        ])
      })
    })
  })
})
