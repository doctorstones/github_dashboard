import GithubService from "../../services/GithubService"

describe('GithubService', () => {

  it('fetchAllIssues - Pulls', async () => {

    const result = await GithubService.fetchAllIssues('pulls');
    expect(result).toBeDefined()

  })

  it('fetchAllIssues - Issues', async () => {

    const result = await GithubService.fetchAllIssues('issues');
    expect(result).toBeDefined()

  })

  it('fetchPullsDetail', async () => {

    const result = await GithubService.fetchPullsDetail();
    expect(result).toBeDefined()
    
    const result_cached = await GithubService.fetchPullsDetail();
    expect(result_cached).toBeDefined()
    expect(result_cached).toBe(result)

  })

  it('getPullsBySize', async () => {

    const result = await GithubService.getPullsBySize();
    expect(result).toBeDefined()

  })

  it('getPullsAverageMergeTime', async () => {

    const result = await GithubService.getPullsAverageMergeTime();
    expect(result).toBeDefined()

  })

  it('getIssuesAverageCloseTime', async () => {

    const result = await GithubService.getIssuesAverageCloseTime();
    expect(result).toBeDefined()

  })

  it('getIssuesForPeriod', async ()=>{
    const result = await GithubService.getIssuesForPeriod({queryKey:['pulls'],meta:undefined});
    expect(result).toBeDefined()
  })


})