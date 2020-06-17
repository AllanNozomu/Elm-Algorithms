module Pages.Sort.Model exposing (Model, SortType(..), initModel, sortTypeToString, stringToSortType, sortTypeLength)

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
    }


initModel : SortType -> Model
initModel sortType =
    { seed = 0
    , listToBeSorted = []
    , steps = Array.empty
    , sortType = sortType
    , currentStep = Array.empty
    , listLength = sortTypeLength sortType
    , orderedList = Array.empty
    , leftRightSequence = Array.empty
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    }


type SortType
    = MergeSort
    | SelectionSort
    | BubbleSort

sortTypeLength : SortType -> Int
sortTypeLength sortType =
    case sortType of
       MergeSort -> 256
       SelectionSort -> 64
       BubbleSort -> 64

sortTypeToString : SortType -> String
sortTypeToString sortType = 
    case sortType of
       MergeSort -> "MergeSort"
       SelectionSort -> "SelectionSort"
       BubbleSort -> "BubbleSort"

stringToSortType : String -> SortType
stringToSortType str = 
    case str of
       "MergeSort" -> MergeSort
       "SelectionSort" -> SelectionSort
       "BubbleSort" -> BubbleSort
       _ -> MergeSort