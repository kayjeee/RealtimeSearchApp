Rails.application.routes.draw do
  post '/search', to: 'search#search'
  get '/', to: 'search#analytics'
  get '/user_logs', to: 'search#user_logs'
  get '/trends', to: 'search#trends'
  get '/app.js' => 'application#javascript'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end