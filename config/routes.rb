Rails.application.routes.draw do
  #mount_devise_token_auth_for 'User', at: 'auth'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  #root to: 'posts#index'

  resources :posts
  resources :replies
  resources :users
  resources :likes

  get 'likes/is_my_liked/:user_id/:post_id', to:'likes#is_my_liked'
  delete 'likes/delete/:user_id/:post_id', to:'likes#destroy'

  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    registrations: 'auth/registrations'
  }

  namespace :auth do
    resources :sessions, only: %i[index]
  end

end
