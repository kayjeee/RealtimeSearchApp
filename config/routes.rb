Rails.application.routes.draw do
  post '/search', to: 'search#search'
  get '/', to: 'search#analytics'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end