import { AppThunk } from './../../app/store'
import { createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RepoDetails, getRepoDetails} from '../../api/githubAPI'

interface RepoDetailsState {
    openIssuesCount: number
    error: string|null
}

const initialState: RepoDetailsState = {
    openIssuesCount: -1,
    error: null
}

const RepoDetail = createSlice({
    name: 'repoDetails',
    initialState,
    reducers: {
        getRepoDetailsSuccess(state, action: PayloadAction<RepoDetails>){
            state.openIssuesCount = action.payload.open_issues_count
            state.error = null
        },
        getRepoDetailFailed(state, action: PayloadAction<string>){
            state.openIssuesCount = -1
            state.error = action.payload
        }
    }
})


export const {getRepoDetailFailed, getRepoDetailsSuccess} = RepoDetail.actions

export default RepoDetail.reducer

export const fetchIssuesCount = (
    org: string,
    repo: string
    ): AppThunk => async dispatch => {
        getRepoDetails(org, repo).then(
            repoDetails => dispatch(getRepoDetailsSuccess(repoDetails)),
            e => dispatch(getRepoDetailFailed(e.toString()))
        )
}