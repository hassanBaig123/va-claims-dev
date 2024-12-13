import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  try {
    const { data: nodes, error: nodesError } = await supabase
      .schema('public')
      .from('node_templates')
      .select('id, name, type')

    if (nodesError) throw nodesError

    const { data: links, error: linksError } = await supabase
      .schema('public')
      .from('node_relationships')
      .select('parent_node_id, child_node_id')

    if (linksError) throw linksError

    const formattedNodes = nodes.map(node => ({
      id: node.id.toString(),
      name: node.name,
      type: node.type,
    }))

    const formattedLinks = links.map(link => ({
      source: link.parent_node_id?.toString() || '',
      target: link.child_node_id?.toString() || '',
    }))

    return new Response(JSON.stringify({ nodes: formattedNodes, links: formattedLinks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching node data:', error)
    return new Response(JSON.stringify({ error: 'Error fetching node data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
