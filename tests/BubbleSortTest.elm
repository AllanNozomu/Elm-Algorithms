module BubbleSortTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (int, list, string)
import Algorithms.BubbleSort exposing (bubbleSort)
import Test exposing (..)

suite : Test
suite =
    describe "Selection sort test"
        [ test "Empty list" <|
            \_ ->
                Expect.equal [] (bubbleSort [])
        , test "Single element list" <|
            \_ ->
                Expect.equal [ 1 ] (bubbleSort [ 1 ])
        , fuzz (list int) "List of ints" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (bubbleSort randomList)
        , fuzz (list string) "List of strings" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (bubbleSort randomList)
        ]
