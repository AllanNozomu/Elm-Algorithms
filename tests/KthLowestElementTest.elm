module KthLowestElementTest exposing (..)

import Array
import Expect exposing (Expectation)
import Fuzz exposing (int, list, string)
import KthLowestElement exposing (kthLowestElement)
import Random
import Test exposing (..)


suite : Test
suite =
    describe "KthElementTest sort test"
        [ test "Empty List" <|
            \_ ->
                Expect.equal Nothing (kthLowestElement [] 1)
        , test "Lower inbound" <|
            \_ ->
                Expect.equal Nothing (kthLowestElement [ 4, 3, 2, 5, 1, 6 ] -1)
        , test "Bigger inbound" <|
            \_ ->
                Expect.equal Nothing (kthLowestElement [ 4, 3, 2, 5, 1, 6 ] 10)
        , test "Index 0" <|
            \_ ->
                Expect.equal Nothing (kthLowestElement [ 4, 3, 2, 5, 1, 6 ] 0)
        , test "First test" <|
            \_ ->
                Expect.equal (Just 1) (kthLowestElement [ 4, 3, 2, 5, 1, 6 ] 1)
        , test "Last test" <|
            \_ ->
                Expect.equal (Just 6) (kthLowestElement [ 4, 3, 2, 5, 1, 6 ] 6)
        , test "Middle test" <|
            \_ ->
                Expect.equal (Just 3) (kthLowestElement [ 4, 3, 2, 5, 1, 6 ] 3)
        , fuzz2 (list int) int "Random invalid negative positions" <|
            \randomList seed ->
                let
                    ( randomPosition, _ ) =
                        Random.step (Random.int 1 <| List.length randomList) (Random.initialSeed seed)
                in
                Expect.equal Nothing (kthLowestElement randomList -randomPosition)
        , fuzz2 (list int) int "Random invalid bigger positions" <|
            \randomList seed ->
                let
                    ( randomPosition, _ ) =
                        Random.step (Random.int 1 <| List.length randomList) (Random.initialSeed seed)
                in
                Expect.equal Nothing (kthLowestElement randomList <| randomPosition + List.length randomList)
        , fuzz2 (list string) int "Random position of random list of strings" <|
            \randomList seed ->
                let
                    ( randomPosition, _ ) =
                        Random.step (Random.int 1 <| List.length randomList) (Random.initialSeed seed)

                    expectedValue =
                        randomList
                            |> List.sort
                            |> Array.fromList
                            |> Array.get (randomPosition - 1)
                in
                Expect.equal expectedValue (kthLowestElement randomList randomPosition)
        ]
