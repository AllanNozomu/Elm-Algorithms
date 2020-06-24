module Pages.Sort.Model exposing (Model, SortType(..), initModel, sortTypeToString, stringToSortType, sortTypeLength, sortTypeToCodeUrl)

import Array exposing (Array)

type alias Model =
    { seed : Int
    , listToBeSorted : List Int
    , orderedList : Array Int
    , steps : Array (Array Int)
    , sortType : SortType
    , currentStep : Array Int
    , listLength : Int
    , leftRightSequence : Array ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    , pause : Bool
    , code : String
    }


initModel : SortType -> Model
initModel sortType =
    { seed = 0
    , listToBeSorted = List.range 0 (sortTypeLength sortType - 1) 
    , steps = Array.empty
    , sortType = sortType
    , currentStep = Array.empty
    , listLength = sortTypeLength sortType
    , orderedList = List.range 0 (sortTypeLength sortType - 1) |> Array.fromList
    , leftRightSequence = Array.empty
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    , code = ""
    }


type SortType
    = MergeSort
    | SelectionSort
    | BubbleSort
    | QuickSort

sortTypeLength : SortType -> Int
sortTypeLength sortType =
    case sortType of
       MergeSort -> 256
       SelectionSort -> 64
       BubbleSort -> 64
       QuickSort -> 256

sortTypeToString : SortType -> String
sortTypeToString sortType = 
    case sortType of
       MergeSort -> "MergeSort"
       SelectionSort -> "SelectionSort"
       BubbleSort -> "BubbleSort"
       QuickSort -> "QuickSort"

stringToSortType : String -> SortType
stringToSortType str = 
    case str of
       "MergeSort" -> MergeSort
       "SelectionSort" -> SelectionSort
       "BubbleSort" -> BubbleSort
       "QuickSort" -> QuickSort
       _ -> MergeSort

sortTypeToCodeUrl : SortType -> String
sortTypeToCodeUrl sortType = 
    case sortType of
       MergeSort -> "src/Algorithms/MergeSort.elm"
       SelectionSort ->  "src/Algorithms/SelectionSort.elm"
       BubbleSort ->  "src/Algorithms/BubbleSort.elm"
       QuickSort ->  "src/Algorithms/QuickSort.elm"