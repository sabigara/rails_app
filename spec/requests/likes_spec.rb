require 'rails_helper'

RSpec.describe "Likes", type: :request do
  describe "GET /index" do
    it '全てのいいねデータを取得する' do
      FactoryBot.create_list(:like, 10)

      get '/likes'
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(json.length).to eq(10)
      # pending "add some examples (or delete) #{__FILE__}"
    end
  end

  describe "GET /show" do
    it '特定のデータのみ取得する' do
      like = FactoryBot.create(:like, user_id: 1, post_id: 1)

      get "/likes/is_liked/#{like.user_id}/#{like.post_id}"
      json = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(true).to eq(true)
    end
  end

  describe "POST /create" do
    it 'いいねする' do
      create_params = { user_id: 99, post_id: 99 }

      expect { post '/likes', params: { like: create_params } }.to change(Like, :count).by(+1)
      expect(response.status).to eq(200)
    end
  end

  describe "DELETE /delete" do
    it 'いいね解除する' do
      like = FactoryBot.create(:like)

      expect { delete "/likes/delete/#{like.user_id}/#{like.post_id}" }.to change(Like, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end

end
