def split_path_and_params(path:str):
    path_params = path.split('?')
    path, params = path_params[0], path_params[1] if path_params.__len__() > 1 else None

    path = path.split('/')[1:]

    if params != None:
        params=params.split('&')

        params = list(map(lambda x: x.split('='),params))
        params = {pair[0]:pair[1] for pair in params}

    return path, params
