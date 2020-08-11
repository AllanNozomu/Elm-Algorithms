module Pages.Sort.Model exposing (Model, SortInfo, SortType(..), getSortInfo, initModel, sortInfos)

import Array exposing (Array)
import Dict exposing (Dict)
import Pages.Sort.Algorithms.BubbleSort exposing (bubbleSortSteps)
import Pages.Sort.Algorithms.MergeSort exposing (mergeSortSteps)
import Pages.Sort.Algorithms.QuickSort exposing (quickSortSteps)
import Pages.Sort.Algorithms.SelectionSort exposing (selectionSortSteps)
import Random

type alias Model =
    { seed : Random.Seed
    , listToBeSorted : List Int
    , orderedList : Array Int
    , steps : Array (Array Int)
    , currentStep : Array Int
    , listLength : Int
    , leftRightSequence : Array ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    , pause : Basics.Bool
    , sortInfo : SortInfo
    , code : String
    , width : Float
    }


type alias SortInfo =
    { sortType : SortType
    , sortName : String
    , codeUrl : String
    , maxLength : Int
    , stepsFunction : List Int -> ( List Int, List (List Int), List ( Int, Int ) )
    }


sortInfos : Dict String SortInfo
sortInfos =
    Dict.fromList
        [ ( "SelectionSort", SortInfo SelectionSort "SelectionSort" "src/Algorithms/SelectionSort.elm" 64 selectionSortSteps )
        , ( "MergeSort", SortInfo MergeSort "MergeSort" "src/Algorithms/MergeSort.elm" 256 mergeSortSteps )
        , ( "QuickSort", SortInfo QuickSort "QuickSort" "src/Algorithms/QuickSort.elm" 256 quickSortSteps )
        , ( "BubbleSort", SortInfo BubbleSort "BubbleSort" "src/Algorithms/BubbleSort.elm" 64 bubbleSortSteps )
        ]


getSortInfo : String -> SortInfo
getSortInfo sortName =
    Dict.get sortName sortInfos |> Maybe.withDefault (SortInfo SelectionSort "SelectionSort" "src/Algorithms/SelectionSort.elm" 64 selectionSortSteps)


initModel : String -> Model
initModel sortType =
    let
        sortInfo =
            getSortInfo sortType
    in
    { seed = Random.initialSeed 1
    , listToBeSorted = List.range 0 (sortInfo.maxLength - 1)
    , steps = Array.empty
    , currentStep = Array.empty
    , listLength = sortInfo.maxLength
    , orderedList = List.range 0 (sortInfo.maxLength - 1) |> Array.fromList
    , leftRightSequence = Array.empty
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    , sortInfo = sortInfo
    , code = ""
    , width = 512
    }


type SortType
    = MergeSort
    | SelectionSort
    | BubbleSort
    | QuickSort
