def main(args):
    keyword = args.get("keyword")
    greeting = "Ajinkya Gadgil says " + keyword
    return {"body": greeting}