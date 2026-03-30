import { mock } from 'mockjs'

const TOTAL = 2000

function createItem(id) {
  return {
    id,
    title: `虚拟列表数据-${id}`,
    createdAt: Date.now() - id * 1000 * 30,
  }
}

mock(/\/api\/items(\?.*)?$/, 'get', (req) => {
  const url = new URL(req.url, 'http://localhost')
  const limit = Number(url.searchParams.get('limit') || 50)
  const cursor = Number(url.searchParams.get('cursor') || 0)

  const startId = cursor > 0 ? cursor + 1 : 1
  const endId = Math.min(startId + limit - 1, TOTAL)
  const items = []
  for (let id = startId; id <= endId; id++) {
    items.push(createItem(id))
  }

  const hasMore = endId < TOTAL
  const nextCursor = hasMore ? endId : null

  return {
    code: 200,
    msg: 'ok',
    items,
    hasMore,
    nextCursor,
  }
})
