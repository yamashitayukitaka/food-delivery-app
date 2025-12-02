import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // リクエスト URL からクエリパラメータを取得
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input') || ''           // input が無ければ空文字
  const sessionToken = searchParams.get('sessionToken') || ''

  // デバッグ用
  console.log('input:', input)
  console.log('sessionToken:', sessionToken)

  // ここで DB や外部 API を呼ぶ



}
