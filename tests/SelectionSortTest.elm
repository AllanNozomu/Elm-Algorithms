module SelectionSortTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (int, list, string)
import Algorithms.SelectionSort exposing (selectionSort)
import Test exposing (..)

suite : Test
suite =
    describe "Selection sort test"
        [ test "Empty list" <|
            \_ ->
                Expect.equal [] (selectionSort [])
        , test "Single element list" <|
            \_ ->
                Expect.equal [ 1 ] (selectionSort [ 1 ])
        , fuzz (list int) "List of ints" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (selectionSort randomList)
        , fuzz (list string) "List of strings" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (selectionSort randomList)
        ]
