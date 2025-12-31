from threading import Thread
from app import mira_app    
from app2 import mood_app 
from app3 import meditation_app  

def run_mira():
    mira_app.run(port=5000, debug=True, use_reloader=False)

def run_mood():
    mood_app.run(port=5001, debug=True, use_reloader=False)

def run_meditation():
    meditation_app.run(port=5002, debug=True, use_reloader=False)

if __name__ == "__main__":  
    print("🚀 Starting both Flask servers...")

    t1 = Thread(target=run_mira)
    t2 = Thread(target=run_mood)
    t3 = Thread(target=run_meditation)

    t1.start()
    t2.start()
    t3.start()

    t1.join()
    t2.join()
    t3.join()