import re

#read file and create array of events
text = open("events", "r").read()
textArr = re.findall(r'\[[\w\s/|→",.+—\-()]+\]', text)
print(len(textArr))

#separate columns in each event item
attributeSeparate = []
attributeSeparate.append()
for x in textArr:
    attributeSeparate.append(re.findall(r'"[\w\s/|→,.+—\-()]+"', x))
    print(attributeSeparate[len(attributeSeparate) - 1])

for x in attributeSeparate:
    if(x[7] != '"null"'):
        temp = x[7].sub
#for each each item, put event info in event table and put event bike info in event_bike table

out = open("conv_events", "w")
for x in attributeSeparate:
    for y in x:
        out.write(y + ", ")
    out.write("\n")

#for x in attributeSeparate:
    #print(re.findall(r'[A-Z]{2,3}[0-9]{3}',x))
