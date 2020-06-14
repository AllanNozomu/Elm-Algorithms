module Pages.Sort.Model exposing (Model, SortType(..), initModel)

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


initModel : Model
initModel =
    { seed = 0
    , listToBeSorted = []
    , steps = Array.empty
    , sortType = MergeSort
    , currentStep = Array.empty
    , listLength = 256
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
