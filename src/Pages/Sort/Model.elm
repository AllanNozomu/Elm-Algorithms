module Pages.Sort.Model exposing (Model, SortType(..), initModel, sortTypeToString, stringToSortType, sortTypeLength, sortTypeToCode)

import Array exposing (Array)
import Pages.Sort.Algorithms.BubbleSort as BubbleSort exposing (strCode)
import Pages.Sort.Algorithms.MergeSort as MergeSort exposing (strCode)
import Pages.Sort.Algorithms.QuickSort as QuickSort exposing (strCode)
import Pages.Sort.Algorithms.SelectionSort as SelectionSort exposing (strCode)

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

sortTypeToCode : SortType -> String
sortTypeToCode sortType = 
    case sortType of
       MergeSort -> MergeSort.strCode
       SelectionSort -> SelectionSort.strCode
       BubbleSort -> BubbleSort.strCode
       QuickSort -> QuickSort.strCode