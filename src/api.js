const API_END_POINT = "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

const request = async nodeId => {
  try {
    const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ''}`);
    if (!res.ok) {
      throw new Error('strange server state');
    }
    return await res.json()
  } catch (e) {
    throw new Error(`somthing wrong!${e.message}`)
  }
}
export { request }
