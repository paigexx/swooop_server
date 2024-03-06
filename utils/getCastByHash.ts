export const getCastByHash = async(hash: string, fid: number) => {
  try {
    const res = await fetch(`https://hub.pinata.cloud/v1/castById?fid=${fid}&hash=${hash}`)
    const data = await res.json();
    return {
      text: data.data.castAddBody.text, 
      timestamp: data.data.timestamp
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}