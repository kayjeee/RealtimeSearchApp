Rails.application.routes.draw do
  post '/search', to: 'search#search'
  get '/', to: 'search#analytics'
  get '/user_logs', to: 'search#user_logs'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end