module MergeSortTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (int, list, string)
import MergeSort exposing (mergeSort)
import Test exposing (..)

suite : Test
suite =
    describe "Merge sort test"
        [ test "Empty list" <|
            \_ ->
                Expect.equal [] (mergeSort [])
        , test "Single element list" <|
            \_ ->
                Expect.equal [ 1 ] (mergeSort [ 1 ])
        , fuzz (list int) "List of ints" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (mergeSort randomList)
        , fuzz (list string) "List of strings" <|
            \randomList ->
                randomList
                    |> List.sort
                    |> Expect.equal (mergeSort randomList)
        ]
