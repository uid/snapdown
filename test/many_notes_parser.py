import csv
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from statistics import median

omni_data = list(csv.reader(open("many_notes.csv")))

correct_submits_sp20 = []
num_attempts_sp20 = []
correct_submits_fa20 = []
num_attempts_fa20 = []

for row in omni_data:
	if "/classes" in row[0]:
		continue

	if row[1]:
		submits_sp20 = row[1].split(',')
		cur_time = 0
		for i in range(len(submits_sp20)):
			cur_time += float(submits_sp20[i])
			print(row[0][i])
			if row[0][i] == 'T':
				correct_submits_sp20.append(cur_time)
				num_attempts_sp20.append(i + 1)
				break

	if row[3]:
		submits_fa20 = row[3].split(',')
		cur_time = 0
		for i in range(len(submits_fa20)):
			cur_time += float(submits_fa20[i])
			if row[2][i] == 'T':
				correct_submits_fa20.append(cur_time)
				num_attempts_fa20.append(i + 1)
				break


min_sp20 = min(correct_submits_sp20)
correct_submits_sp20 = [x - min_sp20 for x in correct_submits_sp20]

print(correct_submits_sp20)

min_fa20 = min(correct_submits_fa20)
correct_submits_fa20 = [x - min_fa20 for x in correct_submits_fa20]

plt.plot(correct_submits_sp20, num_attempts_sp20, 'bo')
plt.plot(correct_submits_fa20, num_attempts_fa20, 'ro')

blue_patch = mpatches.Patch(color='blue', label=f'sp20 (avg {str(round(sum(num_attempts_sp20)/len(num_attempts_sp20), 2))}, med {median(num_attempts_sp20)} attempts)')
red_patch = mpatches.Patch(color='red', label=f'fa20 (avg {str(round(sum(num_attempts_fa20)/len(num_attempts_fa20), 2))}, med {median(num_attempts_fa20)} attempts)')
plt.legend(handles=[blue_patch, red_patch])
plt.show()

plt.subplot(2, 1, 1)
plt.title('Spring 2020 Attempts')
n, bins, patches = plt.hist(num_attempts_sp20, 10, facecolor='blue', alpha=0.5)

plt.subplot(2, 1, 2)
plt.title('Fall 2020 Attempts')
n, bins, patches = plt.hist(num_attempts_fa20, 10, facecolor='red', alpha=0.5)
plt.show()

