module Model exposing (Model, SortType(..), initModel)

import Array exposing (Array)
import Browser.Navigation as Nav
import Url


type alias Model =
    { seed : Int
    , listToBeSorted : List Int
    , orderedList : List Int
    , steps : Array (List Int)
    , sortType : SortType
    , currentStep : List Int
    , leftRightSequence : Array ( Int, Int )
    , currentLeft : Int
    , currentRight : Int
    , index : Int
    , pause : Bool
    , url : Url.Url
    , key : Nav.Key
    }


type SortType
    = MergeSort
    | SelectionSort

initModel : Url.Url -> Nav.Key -> Model
initModel url key =
    { seed = 0
    , listToBeSorted = []
    , steps = Array.empty
    , sortType = MergeSort
    , currentStep = []
    , orderedList = []
    , leftRightSequence = Array.empty
    , currentLeft = 0
    , currentRight = 0
    , index = 0
    , pause = True
    , key = key
    , url = url
    }
