module QuickSortTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (int, list, string)
import Algorithms.QuickSort exposing (quickSort)
import Test exposing (..)

suite : Test
suite =
    describe "Merge sort test"
        [ test "Empty list" <|
            \_ ->
                Expect.equal [] (quickSort [])
        , test "Single element list" <|
            \_ ->
                Expect.equal [ 1 ] (quickSort [ 1 ])
        , fuzz (list int) "List of ints" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (quickSort randomList)
        , fuzz (list string) "List of strings" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (quickSort randomList)
        ]
