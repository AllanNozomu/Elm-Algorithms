module TransposeMatrixTest exposing (..)

import Array
import Expect exposing (Expectation)
import Fuzz exposing (string, array)
import Test exposing (..)
import TransposeMatrix exposing (transpose)


suite : Test
suite =
    let
        emptyArray =
            Array.fromList [ Array.empty ]
    in
    describe "Tranpose Matrix elm"
        [ test "Empty Array" <|
            \_ ->
                Expect.equal emptyArray (transpose Array.empty)
        , test "Single Empty array" <|
            \_ ->
                Expect.equal emptyArray (transpose emptyArray)
        , test "Simple matrix" <|
            \_ ->
                let
                    inputMatrix =
                        Array.fromList
                            [ Array.fromList [ 1, 2, 3 ]
                            , Array.fromList [ 4, 5, 6 ]
                            , Array.fromList [ 7, 8, 9 ]
                            ]

                    expectedMatrix =
                        Array.fromList
                            [ Array.fromList [ 1, 4, 7 ]
                            , Array.fromList [ 2, 5, 8 ]
                            , Array.fromList [ 3, 6, 9 ]
                            ]
                in
                Expect.equal expectedMatrix (transpose inputMatrix)
        , test "Simple row" <|
            \_ ->
                let
                    inputMatrix =
                        Array.fromList
                            [ Array.fromList [ 1, 2, 3 ]
                            ]

                    expectedMatrix =
                        Array.fromList
                            [ Array.fromList [ 1 ]
                            , Array.fromList [ 2 ]
                            , Array.fromList [ 3 ]
                            ]
                in
                Expect.equal expectedMatrix (transpose inputMatrix)
        , test "Simple col" <|
            \_ ->
                let
                    inputMatrix =
                        Array.fromList
                            [ Array.fromList [ 1 ]
                            , Array.fromList [ 2 ]
                            , Array.fromList [ 3 ]
                            ]

                    expectedMatrix =
                        Array.fromList
                            [ Array.fromList [ 1, 2, 3 ]
                            ]
                in
                Expect.equal expectedMatrix (transpose inputMatrix)

        ,fuzz (array string) "Row of strings" <|
             \randomArray ->
                 let
                    toColumns = case Array.length randomArray of 
                        0 -> emptyArray
                        _ -> randomArray |> Array.map (\r -> Array.fromList [r]) 
                 in
                    Array.fromList [randomArray] |>
                    transpose |>
                    Expect.equal toColumns

        ,fuzz (array string) "Column of strings" <|
             \randomArray ->
                 let
                    toColumns = case Array.length randomArray of 
                        0 -> emptyArray
                        _ -> randomArray |> Array.map (\r -> Array.fromList [r]) 
                 in
                    toColumns |>
                    transpose |>
                    Expect.equal (Array.fromList [randomArray])
        ]
