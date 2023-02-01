import GithubService from "../../services/GithubService"

describe('GithubService', () => {

  it('fetchAllIssues - Pulls', async () => {

    const result = await GithubService.fetchAllIssues('pulls');
    expect(result).toBeDefined()

  })

  it('fetchAllIssues - Issues', async () => {

    const fetchAll = async () => await GithubService.fetchAllIssues('issues');
    await expect(fetchAll()).rejects.toThrow(Error("Error: Empty Data"))

  })

  it('fetchPullsDetail', async () => {

    const result = await GithubService.fetchPullsDetail();
    const result_cached = await GithubService.fetchPullsDetail();

    expect(result).toBeDefined()
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

    const fetchAll = async () => await GithubService.getIssuesAverageCloseTime();
    await expect(fetchAll()).rejects.toThrow(Error("Error: Error: Empty Data"))

  })


})